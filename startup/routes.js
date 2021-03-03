const express = require('express');
const morgan = require('morgan');

// Middleware
const error = require('../middleware/error');

// Routers
const homeRouter = require('../routes/home');
// const recipeRouter = require('../routes/recipes');
// const categoryRouter = require('../routes/categories');
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
        // Error middleware has to be last.
        .use(error);
}