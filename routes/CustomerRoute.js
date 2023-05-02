const express = require('express')
const route = express.Router();

const {
    SignUp,
    SignIn,
    VerifyUser
} = require("../controllers/Customer/UserController")

route.route('/').get();
route.route('/').get();

//signin, signup
route.route('/register').post(SignUp);
route.route('/verify/:userId/:uniqueString').get(VerifyUser);
route.route('/').get();

//cart

//order

module.exports = route