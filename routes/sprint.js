const express = require('express');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Sprint, validate } = require('../models/sprint');
const { Project } = require('../models/project');
const router = express.Router();
const { findSubGraphs, topologicalSort } = require('../utils/graphs');

// Get all comments
// Only admin can get it.
router.get('/', [auth, admin], async (req, res) => {
    const filter = _.pick(req.query, ['id', 'project', 'startTime', 'status','createdAt', 'updatedAt']);
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

    let { project, startTime, status } = _.pick(req.body, ['project', 'startTime', 'status']);
    
    sprint = await Sprint.create({
        project,
        startTime,
        status
    });
    
    res.status(200).send(_.pick(sprint, ['id', 'project', 'startTime', 'status']));
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

    res.status(200).send(_.pick(sprint, ['id', 'project', 'startTime', 'status']));
});

router.post('/plan', async (req, res) => {
    let issues = [];
    let blockedBy = [], blocking = [];
    let graph = {};
    
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
        graph[issue.id] = { cost: issue.storyPoints, status: issue.status, value: issue.storyPoints, blocking : [], blockedBy : []};
    });
    
    // build vertices
    issues.forEach((issue, i) => {
        blockedData[i].forEach(blocked => {
            graph[blocked.id].blockedBy.push(issue.id);
        });
        blockingData[i].forEach(blocks => {
            graph[blocks.id].blocking.push(issue.id);
        })
    });
    let sortedArray = []// topologicalSort(graph);
    findSubGraphs(graph);

    if(sortedArray.length == 0) {
        res.status(400).send('something went wrong');
    } else {
        res.status(200).send(sortedArray)
    }
});

module.exports = router;