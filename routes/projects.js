const express = require('express');
const _ = require('lodash');
const { Project, validate } = require('../models/project');
const auth = require('../middleware/auth');
const { User } = require('../models/user');
const router = express.Router();

// Get all projects
// Everyone can get it.
router.get('/', async (req, res) => {
    const filter = _.pick(req.query, ['id', 'owner', 'name', 'key']);
    const projects = await Project.findAll({ where : filter,
                                             order: [[ 'name', 'ASC' ]] });
    res.send(projects);
});

// Get all projects that the user owns
// Everyone can get it
router.get('/owner', auth, async (req, res) => {
    const projects = await Project.findAll({ where: {owner: req.user.id}, 
                                             order: [[ 'name', 'ASC' ]] });
    res.send(projects);
});

// Post a new project
// Every authenticated user can post a project
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let { name, key } = _.pick(req.body, ['name', 'key']);
    
    let project = await Project.findOne({ where: { name: name }});
    if (project) return res.status(400).send('Project with this name is already exists');
    
    const owner = req.user.id;
    project = await Project.create({
        name,
        owner,
        key
    });

    const user = await User.findOne({where: {id: req.user.id}});
    await user.addProject(project)
    
    res.status(200).send(_.pick(project, ['id', 'name', 'owner']));
})

// Update a project
// Only Owner of the project and admin
router.put('/:id', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    // If this is not the owner or admin, don't update.
    if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    let { name } = _.pick(req.body, ['name']);

    await Project.update(
        { name: name },
        { where: { id: req.params.id }});

    project = await Project.findByPk(req.params.id);

    res.status(200).send(_.pick(project, ['id', 'name', 'owner']));
});

// Delete a project
// Only the owner and admin
router.delete('/:id', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    // If this is not the owner, don't delete.
    if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    await Project.destroy({
        where: {
          id: req.params.id
        }
    });

    res.status(200).send(_.pick(project, ['id', 'name', 'owner']));
});

// Get all users associated to this project
router.get('/:id/users', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    // If this is not the owner, don't delete.
    if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    users = await project.getUsers();

    res.status(200).send(_.map(users, _.partialRight(_.pick, ['id', 'name', 'email'])));
});

// add a user access to project
router.post('/:id/users', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    // If this is not the owner, don't add.
    if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    const { userId } = _.pick(req.body, ['userId']);

    user = await User.findByPk(userId);
    if (!user) return res.status(400).send('User does not exists');

    await project.addUser(user);

    console.log(user.dataValues);

    res.status(200).send(_.pick(user.dataValues, ['id', 'name', 'email']));
});

// remove a user access to project
router.delete('/:id/users/:userId', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    // If this is not the owner, don't delete.
    if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    user = await project.getUsers({
        where: {
            id: req.params.userId
        }        
    });

    if (!user) return res.status(400).send('User is not a member of this project');

    await project.removeUser(user);

    res.status(200).send(_.map(users, _.partialRight(_.pick, ['id', 'name', 'email'])));
});

// Get all issues associated to this project
router.get('/:id/issues', auth, async (req, res) => {
    let issues = [];
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    epics = await project.getEpics();

    for(i=0; i < epics.length; i++) {
        epicIssues = await epics[i].getIssues();
        issues.push(...epicIssues)
    }

    res.status(200).send(issues);
});

module.exports = router;