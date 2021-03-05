const express = require('express');
const _ = require('lodash');
const { Issue, validate } = require('../models/issue');
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

    let { name, description, epic, asignee, storyPoints, priority, sprint } = _.pick(req.body, ['name', 'description', 'epic', 'asignee', 'storyPoints', 'priority', 'sprint']);

    // Same name for two issues in the same epic is not allowed
    let issue = await Issue.findOne({ where: { name: name, epic: epic }});
    if (issue) return res.status(400).send('An issue in this epic with this name already exists');

    const reporter = req.user.id;
    issue = await Issue.create({
        name,
        description,
        epic,
        reporter,
        asignee,
        storyPoints,
        priority,
        sprint
    });

    res.status(200).send(_.pick(issue, ['id', 'name', 'description', 'epic', 'reporter', 'asignee', 'storyPoints', 'priority', 'sprint']));
})

// Update an issue
// Only Owner of the issue.
router.put('/', auth, async (req, res) => {
    issueId = _.pick(req.body, ['id']);
    if (!issueId) return res.status(400).send('Got no issue ID to update.');

    let issue = await Issue.findByPk(req.body.id);
    if (!issue) return res.status(400).send('Issue does not exist.');

    // If this is not the owner, don't update.
    if (issue.reporter != req.user.id) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    // Should we change reporter also ?
    let { name, description, epic, asignee, storyPoints, priority, sprint } = _.pick(req.body, ['name', 'description', 'epic', 'asignee', 'storyPoints', 'priority', 'sprint']);

    await Issue.update(
        { 
            name: name,
            description: description,
            epic: epic,
            asignee: asignee,
            storyPoints: storyPoints,
            priority: priority,
            sprint: sprint
        },
        { where: { id: req.body.id }});

    issue = await Issue.findByPk(req.body.id);

    res.status(200).send(_.pick(issue, ['name', 'description', 'epic', 'reporter', 'asignee', 'storyPoints', 'priority', 'sprint']));
});

// Delete an issue
// Only the owner
router.delete('/', auth, async (req, res) => {
    issueId = _.pick(req.body, ['id']);
    if (!issueId) return res.status(400).send('Got no issue ID to delete.');

    let issue = await Issue.findByPk(req.body.id);
    if (!issue) return res.status(400).send('Issue does not exist.');

    // If this is not the owner, don't delete.
    if (issue.reporter != req.user.id) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    await Issue.destroy({
        where: {
          id: req.body.id
        }
    });

    res.status(200).send(_.pick(issue, ['name', 'description', 'epic', 'reporter', 'asignee', 'storyPoints', 'priority', 'sprint']));
});

module.exports = router;