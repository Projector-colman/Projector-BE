const config = require("config");
const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');
const { User } = require("./user");

class Project extends Model {};

Project.init({
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: 'id'
    }
  }
}, {
  sequelize: db,
  modelName: 'Project',
  tableName: 'projects'
});

// User validation.
function validateUser(project) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
  });

  return schema.validate(project);
}

// Exports
module.exports.Project = Project;
module.exports.validate = validateUser;