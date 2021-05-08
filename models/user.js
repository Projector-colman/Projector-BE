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
    allowNull: false, // won't allow null
    validate: {
      notEmpty: true, // don't allow empty strings
      len: [2, 255], // only allow values with length between 2 and 255
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // won't allow null
    validate: {
      isEmail: true, // checks for email format (foo@bar.com)
      len: [5, 255], // only allow values with length between 5 and 255
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // won't allow null
    validate: {
      notEmpty: true, // don't allow empty strings
      len: [5, 255], // only allow values with length between 5 and 255
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false, // won't allow null
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