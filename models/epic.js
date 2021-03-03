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
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
  },
  project: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Project,
        key: 'id'
    }
  },
  reporter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: 'id'
    }
  },
  asignee: {
    type: DataTypes.INTEGER,
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