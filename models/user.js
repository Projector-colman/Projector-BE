const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require('joi');
const { DataTypes, Model } = require('sequelize');
const db = require('../startup/db');

class User extends Model {
  // Generate token for each new connected user.
  generateAuthToken() {
    const token = jwt.sign(
      { id: this.id, isAdmin: this.isAdmin },
      config.get("jwtPrivateKey")
    );
    return token;
  };
};

User.init({
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize: db,
  modelName: 'User',
  tableName: 'users'
});

// User validation.
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

// Exports
module.exports.User = User;
module.exports.validate = validateUser;