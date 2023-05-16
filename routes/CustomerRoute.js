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


const {    
    AddToCart,
    RemoveItem,
    GetAllItem,
} = require("../controllers/Customer/CartController")

const { sendVerifyCodePass, CheckVerifyCode, ChangePassUser } = require("../controllers/Customer/ForgotPassword")

route.route('/').get();

//signin, signup
route.route('/user/register').post(SignUp);
route.route('/verify/:userId/:uniqueString').get(VerifyUser);

route.route("/user/login").post(SignIn);
route.route("/user/login/token").get(validateToken, currentToken);
route.route("/user/logout").get(Logout);

//forgot password
route.route("/user/forgot_password").post(sendVerifyCodePass);
route.route("/user/forgot_password/:id").get(CheckVerifyCode);
route.route("/user/change_password/:id").put(ChangePassUser);

//cart
route.route("/add_to_cart/:id").post(AddToCart);
route.route("/remove_item/:id").delete(RemoveItem);
route.route("/cart").get(GetAllItem);

//order
route.route("/order").get(GetAllItem);

module.exports = route