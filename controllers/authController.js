const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/jwtToken");

// signup
const signup = async (req, res) => {
    try {
        const data = req.body;
        const { username, password, email } = data;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const createduser = new User({
            username: username,
            password: hashedPassword,
            email: email,
        });
        const saveuser = await createduser.save();
        res.status(200).send({
            status: "success",
            message: "user saved successfully",
            data: {
                user: username,
            },
        })
    } catch (error) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}

// login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).send({
                status: "failure",
                message: "user does not exist",
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send({
                status: "failure",
                message: "password is incorrect",
            });
        }
        const accessToken = generateToken.generateAccessToken(user);
        const { jwtToken, password: newpass, ...other } = user._doc;
        res.cookie('access-token', accessToken, {
            httpOnly: true,
            expiresIn: '60*10'
        });
        res.status(200).send({
            status: "success",
            message: "logged in successfully",
            data: other,
            accessToken
        });
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}


// Update Email
const updateEmail = async (req, res) => {
    try {
      const { username, newEmail } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).send({
          status: "failure",
          message: "User not found",
        });
      }
  
      user.email = newEmail;
      await user.save();
  
      res.status(200).send({
        status: "success",
        message: "Email updated successfully",
      });
    } catch (error) {
      res.status(500).send({
        status: "failure",
        message: error.message,
      });
    }
  };
  

// logout
const logout = (req, res) => {
    try {

        res.clearCookie('access-token');
        res.send({ message: `Logged Out` })
    } catch (error) {
        res.status(400).send({ message: err });
    }
}
// Forget Password 
const forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send({
          status: "failure",
          message: "User with that email not found",
        });
      }
  
       ///////////////////////////////////////
       // code for sending password reset link via some service 
       ///////////////////////////////////////
  
      res.status(200).send({
        status: "success",
        message: "Password reset link sent successfully",
      });
    } catch (error) {
      res.status(500).send({
        status: "failure",
        message: error.message,
      });
    }
  };
  
  // Reset Password
  const resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send({
          status: "failure",
          message: "User with that email not found",
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).send({
        status: "success",
        message: "Password reset successful",
      });
    } catch (error) {
      res.status(500).send({
        status: "failure",
        message: error.message,
      });
    }
  };
  

// test for jwt middleware for accessing private information
const confidential = (req, res) => {
    try {
        res.json("jwt working");
    } catch (error) {
        res.status(400).send({ message: err });
    }

}


module.exports = { signup, login, logout, confidential, forgetPassword, resetPassword,updateEmail}