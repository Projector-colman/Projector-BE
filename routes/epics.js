const express = require('express');
const _ = require('lodash');
const { Epic, validate } = require('../models/epic');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all epics
// Everyone can get it.
router.get('/', async (req, res) => {
    const epics = await Epic.findAll({ order: [[ 'name', 'ASC' ]] });
    res.send(epics);
});

// Post a new epic
// Every authenticated user can post an epic
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let { name, description, project, asignee } = _.pick(req.body, ['name', 'description', 'project', 'asignee']);

    // Same name for two epics in the same project is not allowed
    let epic = await Epic.findOne({ where: { name: name, project: project }});
    if (epic) return res.status(400).send('An epic in this project with this name is already exists');

    const reporter = req.user.id;
    epic = await Epic.create({
        name,
        description,
        project,
        reporter,
        asignee
    });

    res.status(200).send(_.pick(epic, ['id', 'name', 'description', 'project', 'reporter', 'asignee']));
})

// Delete an epic
// Only the owner
router.delete('/', auth, async (req, res) => {
    epicId = _.pick(req.body, ['id']);
    if (!epicId) return res.status(400).send('Got no epic ID to delete.');

    let epic = await Epic.findByPk(req.body.id);
    if (!epic) return res.status(400).send('Epic does not exist.');

    // If this is not the owner, don't delete.
    if (epic.reporter != req.user.id) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    await Epic.destroy({
        where: {
          id: req.body.id
        }
      })
    res.send(epic);
});

module.exports = router;