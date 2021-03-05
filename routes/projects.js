const express = require('express');
const _ = require('lodash');
const { Project, validate } = require('../models/project');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all projects
// Everyone can get it.
router.get('/', async (req, res) => {
    const projects = await Project.findAll({ order: [[ 'name', 'ASC' ]] });
    res.send(projects);
});

// Post a new project
// Every authenticated user can post a project
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let { name } = _.pick(req.body, ['name']);

    let project = await Project.findOne({ where: { name: name }});
    if (project) return res.status(400).send('Project with this name is already exists');

    const owner = req.user.id;
    project = await Project.create({
        name,
        owner
    });

    res.status(200).send(_.pick(project, ['id', 'name', 'owner']));
})

// Update a project
// Only Owner of the project.
router.put('/:id', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    // If this is not the owner, don't update.
    if (project.owner != req.user.id) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    let { name } = _.pick(req.body, ['name']);

    await Project.update(
        { name: name },
        { where: { id: req.params.id }});

    project = await Project.findByPk(req.params.id);

    res.status(200).send(_.pick(project, ['id', 'name', 'owner']));
});

// Delete a project
// Only the owner
router.delete('/:id', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    // If this is not the owner, don't delete.
    if (project.owner != req.user.id) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    await Project.destroy({
        where: {
          id: req.params.id
        }
    });

    res.status(200).send(_.pick(project, ['id', 'name', 'owner']));
});

module.exports = router;