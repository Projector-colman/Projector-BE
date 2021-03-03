const config = require('config');
const winston = require('winston');
require('express-async-errors');

const mongoServer = config.get('postgres-server');
const dbName = config.get('db-name');
const postgresUser = config.get('postgres-user');
const postgresPassword = config.get('postgres-pass');

const logger = winston.createLogger({
    transports: [
        // new winston.transports.File({ 
        //     filename: 'logs/spoon.log'
        // }),
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true
        }),
    ],
    exceptionHandlers: [
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true
        })
    ],
    rejectionHandlers: [
        new winston.transports.Console({
            colorize: true,
            prettyPrint: true
        })
    ]
});

module.exports = logger;