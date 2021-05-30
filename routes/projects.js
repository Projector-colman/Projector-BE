const express = require('express');
const _ = require('lodash');
const { Project, validate } = require('../models/project');
const auth = require('../middleware/auth');
const { User } = require('../models/user');
const { Epic } = require('../models/epic');
const { Issue } = require('../models/issue');
const { Sprint } = require('../models/sprint');
const router = express.Router();
const { Op } = require('sequelize');

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
    console.log(req.user.id)
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
    
    await project.addUser(user);
    
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
    //if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    users = await project.getUsers();

    res.status(200).send(_.map(users, _.partialRight(_.pick, ['id', 'name', 'email'])));
});

// add a user access to project
router.post('/:id/users', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    // If this is not the owner, don't add.
    //if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

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
    //if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 
    if(req.params.userId == project.owner) return res.status(401).send('Cant delete project owner'); 
    
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
router.get('/:id/issues', async (req, res) => {
    let projectData;

    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    let sprintFilter = _.pick(req.query, ['status']);

    if(sprintFilter.status == 'backlog') {
        projectData = await Project.findOne({
            where:{
                'id': req.params.id,
            },
            include: {
                model: Epic,
                include: {
                    model: Issue,
                    where : {sprint : null,
                             status: {
                                [Op.not] : 'done'
                                }
                            },
                    include: [{
                        model: User,
                        as: 'assignee',
                        attributes: ['id', 'name']
                    },
                    { 
                        model: Issue,
                        as: 'blockers',
                        attributes: ['name']
                    },
                    { 
                        model: Issue,
                        as: 'blocked',
                        attributes: ['name']
                    }]
                }
            }
        });
    } 
    else if (sprintFilter.status) {
        projectData = await Project.findOne({
            where:{
                'id': req.params.id,
            },
            include: {
                model: Epic,
                include: {
                    model: Issue,
                    include: [{
                        model: Sprint,
                        attributes: ['status'],
                        where: sprintFilter
                    },
                    {
                        model: User,
                        as: 'assignee',
                        attributes: ['id', 'name', 'image']
                    },
                    { 
                        model: Issue,
                        as: 'blockers',
                        attributes: ['name']
                    },
                    { 
                        model: Issue,
                        as: 'blocked',
                        attributes: ['name']
                    }]
                }
            }
        });
    }
    else {  
        projectData = await Project.findOne({
            where:{
                'id': req.params.id,
            },
            include: {
                model: Epic,
                include: {
                    model: Issue,
                    include: [{
                        model: Sprint,
                        attributes: ['status'],
                        // where: sprintFilter
                    },
                    {
                        model: User,
                        as: 'assignee',
                        attributes: ['id', 'name', 'image']
                    },
                    { 
                        model: Issue,
                        as: 'blockers',
                        attributes: ['name']
                    },
                    { 
                        model: Issue,
                        as: 'blocked',
                        attributes: ['name']
                    }
                    ]
                }
            }
        });
    }
    var issues = [];

    projectData['Epics'].forEach(epic => {
        epic['Issues'].forEach(issue => {
            if (issue.Sprint) {
                let sprintStatus = issue.Sprint['status'];
                issue.setDataValue('sprintStatus', sprintStatus);
            }
            issues.push(issue);
        });
    });

    await Promise.all(issues);

    res.status(200).send(issues);
});

// Get all sprints associated to this project
router.get('/:id/sprints', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    // If this is not the owner, don't delete.
    //if ((project.owner != req.user.id) && (!req.user.isAdmin)) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    sprints = await project.getSprints();

    res.status(200).send(_.map(sprints, _.partialRight(_.pick, ['id', 'startTime', 'endTime', 'storyPoints', 'status'])));
});

router.get('/:id/done', auth, async (req, res) => {
    let project = await Project.findByPk(req.params.id);
    if (!project) return res.status(400).send('Project does not exist.');

    const issues = await Epic.findAll({
        where : {
            project : project.id
        },
        include: {
            model: Issue,
            where: {
                status: 'done',
                sprint : {
                    [Op.gt]: 0
                }
            },
            include: [{
                model: User,
                as: 'assignee',
                attributes: ['id', 'name', 'image']
            },
            { 
                model: Issue,
                as: 'blockers',
                attributes: ['name']
            },
            { 
                model: Issue,
                as: 'blocked',
                attributes: ['name']
            }]
        }
    });

    res.status(200).send(issues)
});

module.exports = router;