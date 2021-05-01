const express = require('express');
const _ = require('lodash');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const router = express.Router();

// Authenticate a user.
router.post('/', async (req, res) => {
    // If the user in the body request is not valid return error 400.
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // If the user does not exist return error 400.
    let user = await User.findOne({ where: { email: req.body.email }});
    if (!user) return res.status(400).send('Invalid email or password.');
    
    // If the password is not valid return error 400.
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    // Generate a JWT Token and send it back to the user session.
    const token = user.generateAuthToken();
    res.send({token: token});
});

// Validate an auth user request.
function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(user);
}

module.exports = router;