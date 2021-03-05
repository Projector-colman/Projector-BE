const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');
const { Project } = require('./project');
const { User } = require("./user");

class Epic extends Model {};

Epic.init({
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false, // won't allow null
    validate: {
      notEmpty: true, // don't allow empty strings
      len: [2, 255], // only allow values with length between 2 and 255
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true, // allow null
    validate: {
      notEmpty: true, // don't allow empty strings
      len: [0, 255], // only allow values with length between 0 and 255
    }
  },
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
  reporter: {
    type: DataTypes.INTEGER,
    allowNull: false, // won't allow null
    validate: {
      isInt: true, // checks for valid integers
      min: 1, // only allow values >= 1
    },
    references: {
        model: User,
        key: 'id'
    }
  },
  asignee: {
    type: DataTypes.INTEGER,
    allowNull: true, // will allow null
    validate: {
      isInt: true, // checks for valid integers
      min: 1, // only allow values >= 1
    },
    references: {
        model: User,
        key: 'id'
    }
  }
}, {
  sequelize: db,
  modelName: 'Epic',
  tableName: 'epics'
});

// User validation.
function validateUser(epic) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(255),
    project: Joi.number().required(),
    asignee: Joi.number(),
  });

  return schema.validate(epic);
}

// Exports
module.exports.Epic = Epic;
module.exports.validate = validateUser;