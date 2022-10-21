'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    number: DataTypes.INTEGER,
    signup_token: DataTypes.STRING,
    login_token: DataTypes.STRING,
    forgot_pass_token: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
    tableName:'users',
  });
  User.beforeCreate(async (user, options) => {
        const salt = await bcrypt.genSalt(10); //whatever number you want
        user.password = await bcrypt.hash(user.password, salt);
  });
  User.prototype.comparePassword = function (password,cb){
    if(bcrypt.compareSync(password, this.password||'') == true){
        cb(null, true);
    }else{
        return cb('invalid password.',false);
    }
  }
  return User;
};