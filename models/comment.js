const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');
const { Issue } = require('./issue');
const { User } = require('./user');

class Comment extends Model {};

Comment.init({
  // Model attributes are defined here
  description: {
    type: DataTypes.STRING,
    allowNull: true, // allow null
    validate: {
      notEmpty: true, // don't allow empty strings
      len: [1, 255], // only allow values with length between 0 and 255
    }
  },
  writer: {
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
  issue: {
    type: DataTypes.INTEGER,
    allowNull: false, // won't allow null
    validate: {
      isInt: true, // checks for valid integers
      min: 1, // only allow values >= 1
    },
    references: {
        model: Issue,
        key: 'id'
    }
  }
}, {
  sequelize: db,
  modelName: 'Comment',
  tableName: 'issue_comments'
});

// Relations
// user have many comments
User.hasMany(Comment, { foreignKey: 'writer' });
Comment.belongsTo(User);

// issues have many comments
Issue.hasMany(Comment, { foreignKey: 'issue' });
Comment.belongsTo(Issue);

// Object validation.
function validateComment(comment) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(255),
    epic: Joi.number().required(),
    asignee: Joi.number(),
    storyPoints: Joi.number(),
    priority: Joi.number(),
    sprint: Joi.number(),
    status: Joi.string().valid('to-do', 'in-progress', 'verify', 'done'),
  });

  return schema.validate(comment);
}

// Exports
module.exports.Comment = Comment;
module.exports.validate = validateComment;