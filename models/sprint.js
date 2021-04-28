const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');

class Sprint extends Model {};

Sprint.init({
  // Model attributes are defined here
  project: {
    type: DataTypes.INTEGER,
    allowNull: false, // won't allow null
    validate: {
      isInt: true, // checks for valid integers
      min: 1, // only allow values >= 1
    },
    references: {
        model: Project,
        key: 'id'
    }
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false, // won't allow null
    validate: {
      isDate: true,
    }
  },
}, {
  sequelize: db,
  modelName: 'Sprint',
  tableName: 'sprints'
});

// Sprint validation.
function validateSprint(sprint) {
  const schema = Joi.object({
    project: Joi.number().required(),
    date: Joi.date().required(),
  });

  return schema.validate(sprint);
}

// Exports
module.exports.Sprint = Sprint;
module.exports.validate = validateSprint;