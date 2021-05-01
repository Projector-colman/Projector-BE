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
    allowNull: false,
    validate: {
      notEmpty: true, // don't allow empty strings
      len: [2, 255], // only allow values with length between 2 and 255
    }
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  modelName: 'Project',
  tableName: 'projects'
});

// Object validation.
function validateProject(project) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required()
  });

  return schema.validate(project);
}

// Relations
User.belongsToMany(Project, { through: 'UserProjects' });
Project.belongsToMany(User, { through: 'UserProjects' });

// Exports
module.exports.Project = Project;
module.exports.validate = validateProject;