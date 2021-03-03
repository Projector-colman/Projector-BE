const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// // Get my details.
// router.get('/me', auth, async (req, res) => {
//     const user = await User.findById(req.user._id).select('-password');
//     res.send(user);
// });

// Get all users:
// Only Admin can get all the users.
// router.get('/', [ auth, admin ], async (req, res) => {
router.get('/', async (req, res) => {
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
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    // res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;