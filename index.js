const express = require("express");
const app = express();
const userRouter = require("./router/user.router");
const port = 1000;

app.use(express.json());

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.json({
    message:
      "User :: signup :: login :: forgot password :: reset password",
  });
});

app.listen(port, () => {
  console.log("Port is listing :", port);
});


// Make Below Apis
// User Registration
//     -> registration require name, email address and password 
//     -> password validation 
//         -> length minimum 8 and maximum 16
//         -> password must be contail 1 special character and 1 digit 
//     -> send verification link in email address
//     -> user can not login without verify email address
// User Login
//     -> Login via email address and password
// Forgot password
//     -> send reset password link mail to users mail address
//     -> open that link into postman and reset password
// Reset password
//     -> enter new password and confirm password
//     -> after reset password reset password link will be expired

// Note :
// use migrations for create tables
// use models
// use necessory validation for login, registration, forgot password and reset password