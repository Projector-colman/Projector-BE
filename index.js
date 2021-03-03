// This is the starting point of this application.
// Here we are calling all the routes, middlewares and other nessaccery packages we need.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

// All incoming request can parse json data
app.use(bodyParser.json());

const server = require("http").createServer(app);
const config = require("config");
const logger = require("./startup/logging");
const db = require("./startup/db");
const startupDebug = require("debug")("app:startup");
const dbDubug = require('debug')('app:db');

// Startup folder loading.
require("./startup/logging");
require("./startup/validation")();
require("./startup/config")();
require("./startup/db");
require("./startup/routes")(app);
require("./startup/prod")(app);

// Config variables
const port = config.get("port");
const appName = config.get("name");

const mainServer = server.listen(port, () => {
  startupDebug(`${appName} started on port ${port}`);
  logger.info(`${appName} started on port ${port}`);
  console.log('listening on port ', port);
});

db.authenticate()
  .then(() => {
    dbDubug('Connected to PostgreSQL successfuly');
    logger.info('Connected to PostgreSQL successfuly');
  });

module.exports = mainServer;
