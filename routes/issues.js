const express = require('express');
const _ = require('lodash');
const { Issue, validate, validateStatus } = require('../models/issue');
const { Sprint } = require('../models/sprint');
const { Epic } = require('../models/epic');
const { Project } = require('../models/project');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Get all issues
// Only admin can get it.
router.get('/', [auth, admin], async (req, res) => {
    let users = [];
    
    const filter = _.pick(req.query, ['id', 'epic', 'asignee', 'priority', 'sprint', 'status', 'name']);
    const issues = await Issue.findAll({ where: filter,
                                         order: [[ 'name', 'ASC' ]]});
    issues.forEach(issue => users.push(issue.getUser()));

    let data = await Promise.all(users);
    
    data.forEach((user, i) => issues[i].asignee = {id: issues[i].asignee, name : user.name});
    res.send(issues);
});

// Post a new issue
// Every authenticated user can post an issue
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let { name, description, epic, asignee, storyPoints, priority, sprint, status, blockerId } = _.pick(req.body, ['name', 'description', 'epic', 'asignee', 'storyPoints', 'priority', 'sprint', 'status', 'blockerId']);

    // Same name for two issues in the same epic is not allowed
    let issue = await Issue.findOne({ where: { name: name, epic: epic }});
    if (issue) return res.status(400).send('An issue in this epic with this name already exists');

    const reporter = req.user.id;
    
    issue = await Issue.create({
        name,
        epic,
        description,
        reporter,
        asignee,
        storyPoints,
        priority,
        sprint,
        status
    });

     if (blockerId) { 
         blockerIssue = await Issue.findByPk(blockerId);
         if (!blockerIssue) return res.status(400).send('Blocking issue does not exist.');

         issue.createBlocker({ blocker: blockerId, blocked: issue.id });
     }

    res.status(200).send(_.pick(issue, ['id', 'name', 'description', 'epic', 'reporter', 'asignee', 'storyPoints', 'priority', 'sprint', 'status']));
})

// Update an issue
// Only Owner of the issue and admin.
router.put('/:id', auth, async (req, res) => {
    let issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(400).send('Issue does not exist.');

    // If this is not the owner or admin, don't update.
    if ((issue.reporter != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    // Should we change reporter also ?
    let { name, description, epic, asignee, storyPoints, priority, sprint, status } = _.pick(req.body, ['name', 'description', 'epic', 'asignee', 'storyPoints', 'priority', 'sprint', 'status']);

    await Issue.update(
        { 
            name: name,
            description: description,
            epic: epic,
            asignee: asignee,
            storyPoints: storyPoints,
            priority: priority,
            sprint: sprint,
            status: status
        },
        { where: { id: req.params.id }});

    issue = await Issue.findByPk(req.params.id);

    res.status(200).send(_.pick(issue, ['name', 'description', 'epic', 'reporter', 'asignee', 'storyPoints', 'priority', 'sprint', 'status']));
});

// Delete an issue
// Only the owner and admin
router.delete('/:id', auth, async (req, res) => {
    let issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(400).send('Issue does not exist.');

    // If this is not the owner, don't delete.
    if ((issue.reporter != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    await issue.destroy();

    res.status(200).send(_.pick(issue, ['name', 'description', 'epic', 'reporter', 'asignee', 'storyPoints', 'priority', 'sprint', 'status']));
});

// Extra routes

// Get all issues with a spesific status
// Everyone can get it.
router.get('/status/:status', async (req, res) => {
    const { error } = validateStatus(req.params.status);
    if (error) return res.status(400).send(error.details[0].message);

    const issues = await Issue.findAll(
        { where: { status: req.params.status }},    
        { order: [[ 'name', 'ASC' ]] }
    );
    res.send(issues);
});

// Update an issue
// Only Owner of the issue and admin.
router.put('/:id/sprint', auth, async (req, res) => {
    let error = false;

    let issue = await Issue.findByPk(req.params.id, {
        include: {
            model: Epic,
            attributes : ['project']
        }
    });

    if (!issue) return res.status(400).send('Issue does not exist.');

    // Should we change reporter also ?
    let { sprintStatus } = _.pick(req.body, ['sprintStatus']);

    if(sprintStatus == 'backlog') {
        await Issue.update({
            'sprint' : null
        },
        { where : { id : req.params.id }});
    } 

    else {
        let sprint = await Sprint.findOne(
            { where: { project : issue.Epic['project'], 
                       status  : sprintStatus  }});
        
        if(sprint) {
            await Issue.update({
                'sprint' : sprint.id
            },
            { where : { id : req.params.id }});
        } else {
            error = true;
        }
    }
    if(error) {
        res.status(400).send('no such sprint');
    } else {
        res.status(200).send({data: 'done'});
    }
});

module.exports = router;