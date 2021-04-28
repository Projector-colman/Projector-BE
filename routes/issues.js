const express = require('express');
const _ = require('lodash');
const { Issue, validate, validateStatus } = require('../models/issue');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all issues
// Everyone can get it.
router.get('/', async (req, res) => {
    const issues = await Issue.findAll({ order: [[ 'name', 'ASC' ]] });
    res.send(issues);
});

// Post a new issue
// Every authenticated user can post an issue
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let { name, description, epic, asignee, storyPoints, priority, sprint, status } = _.pick(req.body, ['name', 'description', 'epic', 'asignee', 'storyPoints', 'priority', 'sprint', 'status']);

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

    res.status(200).send(_.pick(issue, ['id', 'name', 'description', 'epic', 'reporter', 'asignee', 'storyPoints', 'priority', 'sprint', 'status']));
})

// Update an issue
// Only Owner of the issue.
router.put('/:id', auth, async (req, res) => {
    let issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(400).send('Issue does not exist.');

    // If this is not the owner, don't update.
    if (issue.reporter != req.user.id) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

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
// Only the owner
router.delete('/:id', auth, async (req, res) => {
    let issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(400).send('Issue does not exist.');

    // If this is not the owner, don't delete.
    if (issue.reporter != req.user.id) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    await Issue.destroy({
        where: {
          id: req.params.id
        }
    });

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


module.exports = router;