const { User } = require("../models");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utilities/mail');
const validator = require("../middleware/validation/user.schema");

const PRIVATE_KEY = "vatsal123";

class UserController {

  async signupUser(req, res) {
    try {
      await validator.userValidation(req.body);
      await validator.doesAlreadyExist(req.body);
      var user = await User.create(req.body);
      var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      var result = '';
      for ( var i = 0; i < 20; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      const string = result;
      
      await User.update(
        { 
          signup_token: string,
          verified: false 
        },
        {
          where: { email: req.body.email }, 
        }
        );
        sendWelcomeEmail(req.body.email, req.body.firstName, string)
         
      res.status(201).json({ data: user, status: 201 });
      
    } catch (error) {
      console.log(error, " :: :: :: :: :: error")
      res
      .status(error.status || 500)
      .json({ message: error.message, status: error.status || 500 });
    }    
  }


  async activateUser(req, res) {
    try {
      var token = req.params.token;
      const user = await User.findOne({
        where:{
          signup_token: token
        }
      });
      console.log('user =======>',user);
      if(user){
        user.update({
          signup_token:null,
          verified: true
        })
      }else{
        var error = new Error('token expired');
        throw error;     
      }
      return res.send({
        success: 1,
        message: 'Account successfully activated',
      })
    } catch(err) {
      console.log(err)
      return res.send({
        success: 0,
        error: err.message
      })
    }
  }


  async loginUser (req, res) {
    try {
      const user = await User.findOne({
        where: { email: req.body.email },
        attributes: ["password"],
      });
      if (!user) {
        throw new Error("email not found");
      }

      // console.log("user", user);
      await user.comparePassword(req.body.password, async (err, isMatch) => {
        if (isMatch == true) {
          var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          var charactersLength = characters.length;
          var result = '';
          for ( var i = 0; i < 20; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          const string = result;
          const response = await User.update(
            { login_token: result },
            {
              where: { email: req.body.email }, 
            }
          );
          return res.status(200).json({
            success: 200,
            message : "successfully logged in",
            token : jwt
          });
        }
        throw new Error("password not match");
      });
    } catch (err) {
      res.status(401).json({ message: err.message, status: 401 });
    }
  }


  async forgotPassword(req, res) {
    try {
      var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      var result = '';
      for ( var i = 0; i < 20; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      const string = result;
      // console.log('le le = ', jwt)

      const response = await User.update(
        { forgot_pass_token: result },
        {
          where: { email: req.body.email }, 
        }
      );

    sendPasswordResetEmail(req.body.email, req.body.firstName, jwt)
    res.send({
      message: "Check your email"
    })

    } catch(err) {
      console.log(err)
      res.send({
        success: 0,
        errorMessage: err
      })
    }
  }

  async resetPassword(req, res) {
    try {
      // const users_token = res.locals.token
      // console.log('utct = ', users_token)

      const users_token = req.query.token

      const response = await User.findOne({
        where: { email: req.body.email },
        attributes: ["forgot_pass_token"],
      })

      const forgot_pass_token = response.dataValues.forgot_pass_token

      if (forgot_pass_token !== users_token)
        return res.send({
          success: 0,
          message: 'Token mismatch'
        })

      let newPassword = req.body.newPassword
      const salt = await genSaltSync(10);
      newPassword = await hashSync(newPassword, salt);

      await User.update(
        { 
          password: newPassword,
          forgot_pass_token: null
        },
        {
          where: { email: req.body.email },
        }
      )

      return res.send({
        success: 1,
        message: 'Password reset/updated successfully'
      })

    } catch(err) {
      console.log(err)
      res.send({
        success: 0,
        errorMessage: err
      })
    }
  }

    // async accountActivate (req, res) {
    //   try {
        
    //   }catch(error){
    //   res.status(401).json({ message: err.message, status: 401 });
    //   }
    // }

  

  // async findAllUser(req, res) {
  //   try {
  //     const firstName = req.query.firstName;
  //     var condition = firstName
  //       ? { firstName: { [Op.iLike]: `%${firstName}%` } }
  //       : null;
  //     var users = await User.findAll({ where: condition });
  //     console.log(users, ':: :: :: USER')
  //     return res.status(200).json({
  //       status: 200,
  //       data: users,
  //     });
  //   } catch (err) {
  //     res.status(501).json({ message: err.message, status: 501 });
  //   }
  // }

  // async findOneUser(req, res) {
  //   try {
  //     const id = req.params.id;

  //     var users = await User.findByPk(id);
  //     // console.log(users);
  //     return res.status(200).json({
  //       status: 200,
  //       data: users,
  //     });
  //   } catch (err) {
  //     res.status(501).json({ message: err.message, status: 501 });
  //   }
  // }

  // async deleteUser(req, res) {
  //   try {
  //     var id = req.params.id;
  //     // await validator.enterID(req.params.id);
  //     var users = await User.destroy({ where: { id: id } });
  //     if (users == 1) {
  //       res.send({ message: "user data delete successfully" });
  //     } else {
  //       res.send({ message: "user data can not delete" });
  //     }
  //   } catch (err) {
  //     res.status(501).json({ message: err.message, status: 501 });
  //   }
  // }

  // async updateUser(req, res) {
  //   try {
  //     const id = req.body.id;
  //     const body = req.body;
  //     const salt = genSaltSync(10);
  //     body.password = hashSync(body.password, salt);
  //     await validator.userValidation(req.body);
  //     await validator.doesAlreadyExist(req.body);
  //     const users = await User.update(req.body, { where: { id: id } });

  //     if (users == 1) {
  //       res.send({ message: "data update successfully" });
  //     } else {
  //       res.send({ message: "data not updated" });
  //     }
  //   } catch (err) {
  //     res.status(501).json({ message: err.message, status: 501 });
  //   }
  // }
}

module.exports = new UserController();
