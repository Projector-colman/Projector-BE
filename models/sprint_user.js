const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');
const { Sprint } = require('./sprint');
const { User } = require('./user');

class User_Sprint extends Model {};

User_Sprint.init({
    UserId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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
    SprintId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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
    story_points: {
        type: DataTypes.INTEGER,
        allowNull: false, // won't allow null
        validate: {
        isInt: true, // checks for valid integers
        },
    }
  }, {
    sequelize: db,
    modelName: 'User_Sprint',
    tableName: 'UserSprints'
  }
);

// Exports
module.exports.User_Sprint = User_Sprint;