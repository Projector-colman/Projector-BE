const express = require('express');
const _ = require('lodash');
const { Comment, validate } = require('../models/comment');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Get all comments
// Only admin can get it.
router.get('/', [auth, admin], async (req, res) => {
    const filter = _.pick(req.query, ['id', 'writer', 'issue', 'createdAt', 'updatedAt']);
    const comments = await Comment.findAll({ 
        where: filter,
        order: [[ 'createdAt', 'ASC' ]] 
    });
    
    res.send(comments);
});

// Post a new comment
// Every authenticated user can post an comment
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let { description, issue } = _.pick(req.body, ['description', 'issue']);

    let writer = req.user.id;

    comment = await Comment.create({
        description: description,
        issue: issue,
        writer: writer,
    });

    res.status(200).send(_.pick(comment, ['id', 'description', 'issue', 'writer', 'createdAt', 'ipdatedAt']));
});

module.exports = router;