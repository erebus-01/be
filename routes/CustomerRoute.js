const express = require('express')
const route = express.Router();

const {
    SignUp,
    SignIn,
    VerifyUser,
    currentToken,
    Logout,
    CheckSession
} = require("../controllers/Customer/UserController")

const { validateToken } = require("../middleware/validateTokenUser")


const {    
    AddToCart,
    RemoveItem,
    GetAllItem,
    CountCart,
    CheckoutVnPay
} = require("../controllers/Customer/CartController")

const { sendVerifyCodePass, CheckVerifyCode, ChangePassUser } = require("../controllers/Customer/ForgotPassword")

route.route('/').get();

route.route('/user/check_session').get(CheckSession);

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
route.route("/user/add_to_cart").post(AddToCart);
route.route("/remove_item/:id").delete(RemoveItem);
route.route("/user/count_cart/:userId").get(CountCart);
route.route("/cart/:userId").get(GetAllItem);
route.route("/checkout_vnpay").post(CheckoutVnPay);


//order
route.route("/order").get(GetAllItem);

module.exports = route