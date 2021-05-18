const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');
const { Project } = require('./project');

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
  storyPoints: {
    type: DataTypes.INTEGER,
    allowNull: false, // won't allow null
    validate: {
      isInt: true, // checks for valid integers
      min: 1, // only allow values >= 1
    },
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false, // won't allow null
    validate: {
      isDate: true,
    }
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false, // won't allow null
    validate: {
      isDate: true,
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'planned', 'backlog'),
    allowNull: true, // will allow null
    defaultValue: null
  }
}, {
  sequelize: db,
  modelName: 'Sprint',
  tableName: 'sprints'
});

// Relations
// project have many sprints
Project.hasMany(Sprint, { foreignKey: { name: 'project' } });
Sprint.belongsTo(Project, { foreignKey: { name: 'project' } });

// Sprint validation.
function validateSprint(sprint) {
  const schema = Joi.object({
    project: Joi.number().required(),
    date: Joi.date().required(),
    status: Joi.string().valid('active', 'planned', 'backlog'),
  });

  return schema.validate(sprint);
}

// Exports
module.exports.Sprint = Sprint;
module.exports.validate = validateSprint;