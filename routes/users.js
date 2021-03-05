const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const { Issue } = require('../models/issue');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// // Get my details.
router.get('/me', auth, async (req, res) => {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.send(user);
});

// Get all users:
// Only Admin can get all the users.
router.get('/', [ auth, admin ], async (req, res) => {
    const users = await User.findAll();
    res.send(users);
});

// Create a new user:
// Anyone can create a user.
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ where: { email: req.body.email }});
    if (user) return res.status(400).send('User already registered.');

    let { name, email, password } = _.pick(req.body, ['name', 'email', 'password']);
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({
        name,
        email,
        password
    });

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['id', 'name', 'email']));
});

// Update a user:
// Only the user itself.
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    console.log(req.params.id);
    let user = await User.findByPk(req.params.id);
    if (!user) return res.status(400).send('User does not exist.');

    // If this is not the user, don't update.
    if (req.params.id != req.user.id) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    let { name, email, password } = _.pick(req.body, ['name', 'email', 'password']);
    
    // If email already exists anywhere in the system.
    let userWithEmail = await User.findOne({ where: { email: email }});
    if (userWithEmail) return res.status(400).send('Email already exists in another user.');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    await User.update(
        { 
            name: name,
            email: email,
            password: password
        },
        { where: { id: req.params.id }});

    user = await User.findByPk(req.params.id);

    res.send(_.pick(user, ['id', 'name', 'email']));
});

// Delete a user
// Only the owner - (Maybe admin too ? -> TODO)
router.delete('/:id', auth, async (req, res) => {
    let user = await User.findByPk(req.params.id);
    if (!user) return res.status(400).send('User does not exist.');

    // If this is not the owner, don't delete.
    if (req.params.id != req.user.id) return res.status(401).send('Access denied. Not the Owner of this resource.'); 

    await User.destroy({
        where: {
          id: req.params.id
        }
    });

    res.status(200).send(_.pick(user, ['id', 'name', 'email']));
});

// Extra Routes

// Get all reporetd issues of a user
router.get('/:id/issues/reported', auth, async (req, res) => {
    let user = await User.findByPk(req.params.id);
    if (!user) return res.status(400).send('User does not exist.');

    const issues = await Issue.findAll({ 
        where: { reporter: user.id },
        order: [[ 'name', 'ASC' ]] 
    });
    res.send(issues);
});

// Get all assigned issues of a user
router.get('/:id/issues/assigned', auth, async (req, res) => {
    let user = await User.findByPk(req.params.id);
    if (!user) return res.status(400).send('User does not exist.');

    const issues = await Issue.findAll({ 
        where: { asignee: user.id },
        order: [[ 'name', 'ASC' ]] 
    });
    res.send(issues);
});

module.exports = router;