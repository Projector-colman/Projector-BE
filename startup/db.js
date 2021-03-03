// const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
const config = require('config');

const postgresServer = config.get('postgres-server');
const dbName = config.get('db-name');
const postgresUser = config.get('postgres-user');
const postgresPassword = config.get('postgres-pass');

module.exports = new Sequelize(dbName, postgresUser, postgresPassword, {
    host: postgresServer,
    dialect: 'postgres'
  });