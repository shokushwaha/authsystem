const router = require("express").Router();
const { signup, login, logout, confidential, resetPassword, forgetPassword, updateEmail} = require('../controllers/authController');
const { verifyAccessToken } = require("../utils/jwtToken");


// route for signup
router.post("/signup", signup);

// route for login
router.post("/login", login);

// route for updating email
router.post('/updateEmail',verifyAccessToken,updateEmail)

// route for forget passwowrd
router.get('/forgetPassword',forgetPassword)

// route for reset password
router.post('/resetPassword',resetPassword)

// route for logout
router.get("/logout", logout);

// accessing private information: protected via jwt middleware
router.get('/confidential', verifyAccessToken, confidential);

module.exports = router;