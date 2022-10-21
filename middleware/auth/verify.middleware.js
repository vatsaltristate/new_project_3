const db = require("../../models");
const User = db.User;
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { verify } = require("jsonwebtoken");
const PRIVATE_KEY = "vatsal123";

class UserMiddleware {


  async checkIfUserExists (req, res, next)  {
    const user = await User.findOne({
      where: { email: req.body.email }
    });
    if(user){
      if(user.dataValues.verified == true){
        next();
      }else{
        res.send({
          success: 0,
          message: "account not verified",
        });        
      }
    }else{
      res.send({
        success: 0,
        message: "User not found in database please signup",
      });
    }
}

async checkEmailPassword (req, res, next) {
    const response = await User.findOne({
      where: { email: req.body.email },
      attributes: ["password"],
    });

    // console.log('aaya :: ', response)
    const usersHashedPassword = response.dataValues.password;
    // console.log('le aaya  :: ', usersHashedPassword)

    const result = compareSync(req.body.password, usersHashedPassword);

    if (!result)
      return res.send({
        success: 0,
        message: "Incorrect password, please try again",
      });

    next();
  }

  async tokenVerification (req, res, next)  {
    let token
    // console.log(token, " :: tokenauth")

    if (req.get("authorization")) 
      token = req.get("authorization").slice(7)
    else if (req.query.token)
      token = req.query.token
    else  
      return res.send({
        success: 0,
        message: "Token not found"
      })

    verify(token, PRIVATE_KEY, (error, decode) => {
      if (error) {
        res.json({
          code: 403,
          message:
            "ohho sorry! token authentication failed please try again !!!",
        });
      } else{
        // res.locals.token = token
        next();
      }
    });
  }

  async signupTokenVerification  (req, res, next) {
    let users_token = req.query.token
    // console.log('utoken = ', users_token)

    try {
      const response = await User.findOne({
        where: { email: req.body.email },
        attributes: ["signup_token"],
      });

      const signup_token = response.dataValues.signup_token
      // console.log('sign token = ', response)

      console.log('ut = ', users_token)
      console.log('st = ', signup_token)

      if (users_token === signup_token) 
        next()
      else 
        return res.send({
          success: 0,
          message: "Activation/signup token authentication failed"
        })
    } catch(err) {
      console.log(err)
    }
  }

  async loginTokenVerification  (req, res, next)  {
    try {
      let users_token = req.get('authorization')
      users_token = users_token.slice(7)

      const response = await User.findOne({
        where: { email: req.body.email },
        attributes: ['login_token']
      })
      // console.log("lt = ", response)

      const login_token = response.dataValues.login_token


      if (users_token === login_token)
        next()
      else
        return res.send({
          success: 0,
          message: 'Login Token mismatch'
        })
    } catch(err) {
      console.log(err)

      res.send({
        success: 0,
        errorMessage: err
      })
    }
  }

  async checkAccountActivated (req, res, next) {
    const response = await User.findOne({
      where: { email: req.body.email }
    })

    if (!response.dataValues.verified) {
      // console.log('ress = ', response)

        res.send({
          success: 0,
          message: 'Account not activated/verified'
        })
    }
    else  
        next()
  }
};

module.exports = new UserMiddleware();