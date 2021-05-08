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
