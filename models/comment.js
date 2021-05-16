const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');
const { Issue } = require('./issue');
const { User } = require('./user');

class Comment extends Model { };

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
  tableName: 'comments'
});

// Relations
// user have many comments
User.hasMany(Comment, { foreignKey: { name: 'writer' } });
Comment.belongsTo(User, { foreignKey: { name: 'writer' } });

// issues have many comments
Issue.hasMany(Comment, { 
  onDelete: 'RESTRICT', 
  foreignKey: { name: 'issue' } 
});
Comment.belongsTo(Issue, { foreignKey: { name: 'issue' }});

// Object validation.
function validateComment(comment) {
  const schema = Joi.object({
    description: Joi.string().max(255),
    issue: Joi.number().required(),
  });

  return schema.validate(comment);
}

// Exports
module.exports.Comment = Comment;
module.exports.validate = validateComment;