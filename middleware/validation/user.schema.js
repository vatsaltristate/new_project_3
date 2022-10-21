const Joi = require("joi");
const promise = require("bluebird");
const { User } = require("../../models");
class Validation {
  async userValidation(body) {
    try {
      var schema = Joi.object({
        // id : Joi.number().required(),  
        firstName: Joi.string().required().trim(),
        lastName: Joi.string().required().trim(),
        gender: Joi.string().required().trim(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().min(8).max(16).required().trim(),  
        // password: Joi.string().regex("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").required().trim(),
        // Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
        number: Joi.number().required(),
      });
      return await schema.validateAsync(body);
    } catch (error) {
      console.log("error :: :: :: ",error)
      // var error = new Error(error.details[0].message); 

      // error.status = 401;
      throw error;
    }
  }

  async doesAlreadyExist(body) {
    const email = body.email;
    const count = await User.count({
      where: {
        email: email,
      },
      attributes: ["email"],
    });
    if (count > 0) {
      var error = new Error("Email already exists");
      error.status = 401;
      throw error;
    }
  }

  // async enterID (params){
  //   // console.log("hello id is working")
  //   const id = params.id
  //   const count = await User.count({  //     where: {
  //       id : id
  //     },
  //     attributes : ['id']
  //   })
  //   // var id = req.params.id;
  //   // if(id == null){
  //   //       utils.fail(res, "ID Param can't be empty");
  //   // }
  //   if (count == 0){
  //     var error = new Error('Please Enter Id');
  //     error.status = 401;
  //     throw error
  //   }
  // }

  // async enterID(id) {
  //   var id = req.params.id;

  // console.log(id, ":: :: :: id")
  //   if (id == null) { 
  //     utils.fail(res, "ID Param can't be empty");
  //   }
  // }
}
module.exports = new Validation();
