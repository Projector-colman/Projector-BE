const express = require('express');
const morgan = require('morgan');

// Middleware
const error = require('../middleware/error');

// Routers
const userRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const homeRouter = require('../routes/home');
const projectRouter = require('../routes/projects');
const epicRouter = require('../routes/epics');
const issueRouter = require('../routes/issues');

const commentRouter = require('../routes/comments');
const sprintRouter = require('../routes/sprints');

module.exports = function(app) {
    app
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(express.static('public'))
        .use(morgan('tiny'))
        .use('/api/users', userRouter)
        .use('/api/auth', authRouter)
        .use('/', homeRouter)
        .use('/api/projects', projectRouter)
        .use('/api/epics', epicRouter)
        .use('/api/issues', issueRouter)
        .use('/api/comments', commentRouter)
        .use('/api/sprints', sprintRouter)
        // Error middleware has to be last.
        .use(error);
}