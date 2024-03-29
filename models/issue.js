const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');
const { Epic } = require('./epic');
const { User } = require("./user");
const { Sprint } = require("./sprint");

class Issue extends Model {};

Issue.init({
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
  epic: {
    type: DataTypes.INTEGER,
    allowNull: false, // won't allow null
    validate: {
      isInt: true, // checks for valid integers
      min: 1, // only allow values >= 1
    },
    references: {
        model: Epic,
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
  },
  storyPoints: {
    type: DataTypes.INTEGER,
    allowNull: true, // will allow null
    validate: {
      isInt: true, // checks for valid integers
      min: 1, // only allow values >= 1
    },
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: true, // will allow null
    validate: {
      isInt: true, // checks for valid integers
      min: 1, // only allow values >= 1
      max: 5, // only allow values <= 5
    },
  },
  sprint: { // This should be reference to Sprint Object.
    type: DataTypes.INTEGER,
    allowNull: true, // will allow null
    validate: {
        isInt: true, // checks for valid integers
        min: 1, // only allow values >= 1
    },
    references: {
      model: Sprint,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('to-do', 'in-progress', 'verify', 'done'),
    allowNull: true, // will allow null
    defaultValue: 'to-do'
  }
}, {
  sequelize: db,
  modelName: 'Issue',
  tableName: 'issues'
});

// Relations
// user reports many issues
User.hasMany(Issue, { foreignKey: { name: 'reporter' } });
Issue.belongsTo(User, { foreignKey: { name: 'reporter' } });

// user assigned to many issues
User.hasMany(Issue, { foreignKey: { name: 'asignee' } });
Issue.belongsTo(User, { as: 'assignee', foreignKey: { name: 'asignee' } });

// epics have many issues
Epic.hasMany(Issue, { foreignKey: { name: 'epic' } });
Issue.belongsTo(Epic, { foreignKey: { name: 'epic' } });

// issues blocks and blocked by many issues
Issue.belongsToMany(Issue, { as: 'blockers', through: 'linked_issues', foreignKey: {name: 'blocked'} });
Issue.belongsToMany(Issue, { as: 'blocked', through: 'linked_issues' , foreignKey: {name: 'blocker'}});

// Sprints have many issues
Sprint.hasMany(Issue, { foreignKey: { name: 'sprint' } });
Issue.belongsTo(Sprint, { foreignKey: { name: 'sprint' } });

// Object validation.
function validateIssue(issue) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(255),
    epic: Joi.number().required(),
    asignee: Joi.number(),
    storyPoints: Joi.number(),
    priority: Joi.number(),
    sprint: Joi.number(),
    status: Joi.string().valid('to-do', 'in-progress', 'verify', 'done'),
    blockerId: Joi.any()
  });

  return schema.validate(issue);
}

function validateStatus(status) {
  const schema = Joi.string().valid('to-do', 'in-progress', 'verify', 'done');
  return schema.validate(status);
}

// Exports
module.exports.Issue = Issue;
module.exports.validate = validateIssue;
module.exports.validateStatus = validateStatus;