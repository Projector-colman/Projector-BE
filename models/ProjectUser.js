const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');
const { Project } = require("./project");
const { User } = require("./user");

class ProjectUser extends Model {};

ProjectUser.init({
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
  user: {
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
  }
}, {
  sequelize: db,
  modelName: 'ProjectUser',
  tableName: 'users_project'
});

// User validation.
function validateProjectUser(projectUser) {
  const schema = Joi.object({
    project: Joi.number().min(1).required(),
    user: Joi.number().min(1).required(),
  });

  return schema.validate(projectUser);
}

// Exports
module.exports.ProjectUser = ProjectUser;
module.exports.validate = validateProjectUser;