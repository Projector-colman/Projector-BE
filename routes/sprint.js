const express = require('express');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Sprint, validate } = require('../models/sprint');
const { Project } = require('../models/project');
const router = express.Router();

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