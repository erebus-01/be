const express = require('express')
const route = express.Router();

const {
    SignUp,
    SignIn,
    VerifyUser,
    currentToken,
    Logout
} = require("../controllers/Customer/UserController")

const { validateToken } = require("../middleware/validateTokenUser")
const {checkBlacklist} = require("../middleware/invalidateTokenLogoutUser")


const {    
    AddToCart,
    RemoveItem
} = require("../controllers/Customer/CartController")

route.route('/').get();
route.route('/').get();

//signin, signup
route.route('/register').post(SignUp);
route.route('/verify/:userId/:uniqueString').get(VerifyUser);
route.route('/').get();

route.route("/user/login").post(SignIn);
route.route("/user/login/token").get(validateToken, currentToken);
route.route("/user/logout").get(Logout, checkBlacklist);


//cart
route.route("/add_to_cart/:id").post(AddToCart);
//order

module.exports = route