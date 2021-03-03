const express = require('express');
const morgan = require('morgan');

// Middleware
const error = require('../middleware/error');

// Routers
const homeRouter = require('../routes/home');
const projectRouter = require('../routes/projects');
const epicRouter = require('../routes/epics');
const userRouter = require('../routes/users');
const authRouter = require('../routes/auth');

module.exports = function(app) {
    app
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(express.static('public'))
        .use(morgan('tiny'))
        .use('/', homeRouter)
        .use('/api/users', userRouter)
        .use('/api/auth', authRouter)
        .use('/api/projects', projectRouter)
        .use('/api/epics', epicRouter)
        // Error middleware has to be last.
        .use(error);
}