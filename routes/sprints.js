const express = require('express');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Sprint, validate } = require('../models/sprint');
const { Project } = require('../models/project');
const router = express.Router();
const { findSubGraphs, topologicalSort, issueIdtoIssueObject } = require('../utils/graphs');

// Get all comments
// Only admin can get it.
router.get('/', [auth, admin], async (req, res) => {
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

router.post('/plan', async (req, res) => {
    let issues = [];
    let blockedBy = [], blocking = [];
    let issuesGraph = {};
    
    let { projectID, workTime } = _.pick(req.body, ['projectID', 'workTime']); 

    let project = await Project.findByPk(projectID);
    if (!project) return res.status(400).send('Project does not exist.');

    epics = await project.getEpics();

    // get issues
    for(i = 0; i < epics.length; i++) {
        epicIssues = await epics[i].getIssues();
        issues.push(...epicIssues)
    }

    issues.forEach(issue => {
        blockedBy.push(issue.getBlocked());
        blocking.push(issue.getBlocker());
    });

    let blockedData = await Promise.all(blockedBy);
    let blockingData = await Promise.all(blocking);

    // build nodes
    issues.forEach(issue => {
        issuesGraph[issue.id] = { cost: issue.storyPoints, status: issue.status, value: issue.storyPoints, blocking : [], blockedBy : []};
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

    let subGraphs = [];
    let subGraphsIndexes = findSubGraphs(issuesGraph);

    subGraphsIndexes.forEach(graphIndexes => {
        let fullGraph = issueIdtoIssueObject(issuesGraph, graphIndexes);
        subGraphs.push(topologicalSort(fullGraph));
    })
    console.log(subGraphs);
    res.status(400).send('something went wrong');
});


module.exports = router;