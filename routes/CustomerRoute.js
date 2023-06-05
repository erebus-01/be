const express = require('express')
const route = express.Router();
const moment = require('moment');
const Order = require("../models/Orders")
const Cart = require("../models/Cart");
const passport = require('passport')

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

const { createOrderFromCart,
    PaymentOrder,
    GetOrderUser } = require('../controllers/Customer/OrderController')


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
route.route("/remove_item/:userId/:productId").delete(RemoveItem);
route.route("/user/count_cart/:userId").get(CountCart);
route.route("/cart/:userId").get(GetAllItem);
route.route("/checkout_vnpay").post(CheckoutVnPay);


//order
route.route("/order").get(GetAllItem);
route.route("/order/:idUser").post(createOrderFromCart);
route.route("/order_payment_vnpay/:idUser").post(PaymentOrder);

route.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

route.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:9000/');
    }
);


route.post('/create_payment_url', function (req, res, next) {
    const { name, phone, address, wards, districts, provinces, price, userId } = req.body

    req.session.name = name;
    req.session.phone = phone;
    req.session.address = address;
    req.session.wards = wards;
    req.session.districts = districts;
    req.session.provinces = provinces;
    req.session.price = price;
    req.session.userId = userId;

    process.env.TZ = 'Asia/Ho_Chi_Minh';

    console.log("create_payment_url")

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let config = require('config');

    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = config.get('vnp_ReturnUrl');
    let orderId = moment(date).format('DDHHmmss');
    let amount = price;
    let bankCode = '';

    let locale = '';
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
    req.session.url = vnpUrl;

    res.status(203).json(req.session.url);
});

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = route