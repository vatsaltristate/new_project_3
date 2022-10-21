const { users } = require('../validation/user.schema');
const db = require("../../models");
const User = db.user;

module.exports = {

    addUserValidation : async (req, res) => {

        const value = await users.validateAsync(req.body);
        console.log('value ======>',value);
        if(value.error){
            // return value.error.details[0].message;
        }
        // return req;
    },


    doesAlreadyExist: async (req, res, next) => {
        const email = req.body.email
        const response = await User.findOne({
            where:{
                email:email
            },
            attributes: ['email']
        })
        if (response != null) {
            return res.status(409).send({
                success: 0,
                message: 'Email already exists'
            })
        }
        next()
    }

}

