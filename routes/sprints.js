const express = require('express');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Sprint, validate } = require('../models/sprint');
const { Project } = require('../models/project');
const { Issue } = require('../models/issue');
const { Epic } = require('../models/epic');

const router = express.Router();
const { getGraphClustersValue,
        findHighestValueCluster } = require('../utils/graphs');
const { Op } = require('sequelize');
const { User_Sprint } = require('../models/sprint_user');

// Get all comments
// Only admin can get it.
router.get('/', auth, async (req, res) => {
    const filter = _.pick(req.query, ['id', 'project', 'startTime', 'endTime', 'status','createdAt', 'updatedAt']);
    const sprints = await Sprint.findAll({ 
        where: filter,
        order: [[ 'createdAt', 'ASC' ]] 
    });
    
    res.send(sprints);
});

// Post a new sprint
// Every authenticated user can post a sprint
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let { project, startTime, status } = _.pick(req.body, ['project', 'startTime', 'endTime', 'status']);
    
    sprint = await Sprint.create({
        project,
        startTime,
        status
    });
    
    res.status(200).send(_.pick(sprint, ['id', 'project', 'startTime', 'endTime', 'status']));
});

// Get all issues associated to this sprint
router.get('/:id/issues', auth, async (req, res) => {
    let sprint = await Sprint.findByPk(req.params.id);
    if (!sprint) return res.status(400).send('Sprint does not exist.');

    let issues = await sprint.getIssues();

    res.status(200).send(issues);
});

// Delete a sprint
// Only the owner and admin
router.delete('/:id', auth, async (req, res) => {
    let sprint = await Sprint.findByPk(req.params.id);
    if (!sprint) return res.status(400).send('Sprint does not exist.');

    project = await Project.findByPk(sprint.project);
    // If this is not the owner, don't delete.
    if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    await Sprint.destroy({
        where: {
          id: req.params.id
        }
    });

    res.status(200).send(_.pick(sprint, ['id', 'project', 'startTime', 'endTime', 'status']));
});

// Get all users associated to this sprint
router.get('/:id/users', auth, async (req, res) => {
    let sprint = await Sprint.findByPk(req.params.id);
    if (!sprint) return res.status(400).send('Sprint does not exist.');

    // If this is not the owner, don't delete.
    // if ((sprint.project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    console.log(sprint);

    users = await sprint.getUsers();

    res.status(200).send(_.map(users, _.partialRight(_.pick, ['id', 'name', 'email'])));
});

router.get('/storypoints', async (req, res) => {
    let { projectID } = _.pick(req.body, ['project']);

    project = await Project.findByPk(projectID);

    // If this is not the owner, don't start.
    if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    // Get all Users
    const sprintUsers = await User_Sprint.findAll(
        {
            attributes: [ 'UserId' ],
            where: {
                SprintId: req.params.id
            }
        }
    );
    
    res.status(200).send(sprintUsers);
});

// start a sprint
router.post('/start', auth, async (req, res) => {
    let { projectID } = _.pick(req.body, ['project']);

    project = await Project.findByPk(projectID);

    // If this is not the owner, don't start.
    if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    await Sprint.update({
        status : "done"
    }, {
        where : {
            project : projectID,
            status : "active"
        }
    });
    let plannedSprint = Sprint.findOne({
        where : {
            project : projectID,
            status : 'planned'
        }
    });

    if(plannedSprint) {
        await Sprint.update({
            status : "active"
        }, {
            where : {
                project : projectID,
                status : "planning"
            }
        });
    
        // Get all issues of this sprint
        const sprintIssues = await Issue.findAll(
            {
                where: {
                    sprint: plannedSprint.id
                }
            }
        );

        let usersStoryPoints = {};

        // Add statistics about this sprint story points per user.
        sprintIssues.forEach((issue) => {
            if(!usersStoryPoints[issue.asignee]) {
                usersStoryPoints[issue.asignee] = 0;
            }
            usersStoryPoints[issue.asignee] += issue.storyPoints;
        });

        let allUsers = Object.keys(usersStoryPoints);

        var finished = allUsers.forEach(async (user) => {
            await User_Sprint.create({
                UserId: user,
                SprintId: sprint.id,
                story_points: usersStoryPoints[user]
            });
        })

        await Promise.all(finished);

        res.status(200).send({data : 'started'});
    } else {
        res.status(400).send({data : 'No planned sprint'});
    }
});

router.post('/plan', async (req, res) => {
    let issues = [];
    let blockedBy = [], blocking = [];
    let issuesGraph = {};

    let { projectID, workTime } = _.pick(req.body, ['projectID', 'workTime']); 

    let project = await Project.findOne({
        where: {
            'id' : projectID
        },
        include: {
            model: Epic,
            include: {
                model: Issue,
                include: [
                    { 
                        model: Issue,
                        as: 'blocker' 
                    },
                    { 
                        model: Issue,
                        as: 'blocked' 
                    }
                ] 
            }
        }
    });
    
    if (!project) return res.status(400).send('Project does not exist.');

    let previousPlanned = await Sprint.findOne({
        where : {
            project : projectID,
            status : 'planned'
        }
    });
    
    // Delete previous planned sprint
    if(previousPlanned) {
        await previousPlanned.destroy();
    }

    await project.reload();

    // Load issues
    project['Epics'].forEach(epic => {
        epic['Issues'].forEach(issue => {
            issues.push(issue);
        });
    });

    issues.forEach(issue => {
        console.log(issue)
        blockedBy.push(issue.getBlocked());
        blocking.push(issue.getBlocker());
    });

    let blockedData = await Promise.all(blockedBy);
    let blockingData = await Promise.all(blocking);

    // build nodes
    issues.forEach(issue => {
        issuesGraph[issue.id] = { cost: issue.storyPoints, status: issue.status, priority: issue.priority, blocking : [], blockedBy : []};
    });
    
    // build vertices
    issues.forEach((issue, i) => {
        blockedData[i].forEach(blocked => {
            issuesGraph[blocked.id].blockedBy.push(issue.id);
        });
        blockingData[i].forEach(blocks => {
            issuesGraph[blocks.id].blocking.push(issue.id);
        })
    });

    let issuesClusterDetails = getGraphClustersValue(issuesGraph);
    let newAssignees = [];
    while(issuesClusterDetails.length > 0) {
        let mostValueableCluster = findHighestValueCluster(issuesClusterDetails);
        mostValueableCluster.details.forEach(issue => {
            let isAssigned = false;
            workTime.forEach(user => {
                if(user.time > issue.points && !isAssigned) {
                    user.time -= issue.points
                    newAssignees.push({issue : issue.id, user : user.id})
                    isAssigned = true;
                }
            })
        })
    }

    let newSprint = await createPlannedSprint(projectID);
    
    for (let i = 0; i < newAssignees; i++) {
        await updateIssue(newAssignees[i].user, newAssignees[i].issue, newSprint.id);   
    }

    res.status(200).send('something went wrong');
});

let createPlannedSprint = async (projectID) => {
    sprint = await Sprint.create({
        project: projectID,
        startTime : undefined,
        status : "planned",
        startTime : null,
        endTime : null
    });
    return sprint;
}

let updateIssue = async (assignee, issueID, sprintID) => {

    await Issue.update(
        { 
            asignee : assignee,
            sprint  : sprintID
        },
        { where: { id: issueID }});
    return true;
}

module.exports = router;