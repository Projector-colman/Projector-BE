const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');
const { Project } = require("./project");
const { User } = require("./user");

// class UserProjects extends Model {};

// UserProjects.init({
//   // Model attributes are defined here
//   project: {
//     type: DataTypes.INTEGER,
//     allowNull: false, // won't allow null
//     validate: {
//       isInt: true, // checks for valid integers
//       min: 1, // only allow values >= 1
//     },
//     references: {
//         model: Project,
//         key: 'id'
//     }
//   },
//   user: {
//     type: DataTypes.INTEGER,
//     allowNull: false, // won't allow null
//     validate: {
//       isInt: true, // checks for valid integers
//       min: 1, // only allow values >= 1
//     },
//     references: {
//         model: User,
//         key: 'id'
//     }
//   }
// }, {
//   sequelize: db,
//   modelName: 'UserProjects',
//   tableName: 'users_project'
// });

// Relation
User.belongsToMany(Project, { through: 'UserProjects' });
Project.belongsToMany(User, { through: 'UserProjects' });

// // User validation.
// function validateUserProjects(userProjects) {
//   const schema = Joi.object({
//     project: Joi.number().min(1).required(),
//     user: Joi.number().min(1).required(),
//   });

//   return schema.validate(userProjects);
// }

// // Exports
// module.exports.UserProjects = UserProjects;
// module.exports.validate = validateUserProjects;