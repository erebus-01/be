const express = require('express');

const Customer = require('../../models/Users');
const Product = require('../../models/Products');
const Cart = require('../../models/Cart')
const moment = require('moment');

const AddToCart = async (req, res) => {
    const { userId, productId, color, quantity, name } = req.body;
    const convertQuantity = parseInt(quantity);

    try {
        if (userId) {
            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                cart = await Cart.create({ user: userId , products: [] })
            }

            const existingProduct = cart.products.find(
                (product) => product.product.equals(productId) && product.color === color
            );
            
            if (existingProduct) {
                existingProduct.quantity += convertQuantity;
            }
            else {
                cart.products.push({ product: productId, name, color, quantity: convertQuantity });
            }

            await cart.save();
            res.status(200).json({ cart });
        }
        else {
            let cart = req.session.cart || [];
            const existingProduct = cart.find(product => product.productId === productId);

            if (existingProduct) {
                existingProduct.quantity += convertQuantity;
            } else {
                cart.push({ productId, quantity: convertQuantity });
            }
            req.session.cart = cart;
            res.status(201).json({ cart });
        }
    }
    catch (err) { res.status(403).json({ message: err }); }
}

const CountCart = async (req, res) => {
    const userId = req.params.userId;
        try {
            const cart = await Cart.findOne({ user: userId });
            if (cart) {
                const productCount = cart.products.length;
                return res.status(201).json( productCount );
            }
            return res.status(203).json('0');
        } catch (error) {
            console.log('Error retrieving cart:', error);
            return res.status(500).json({ error: 'Error retrieving cart' });
        }
};

// const GetAllItem = async (req, res) => {
//     const userId = req.params.userId;

//     if (userId) {
//         const cart = await Cart.findOne({ user: userId });
//         if (!cart) {
//             return res.status(404).json({ message: 'Cart is Empty' });
//         }
//         res.status(201).json( cart.products );
//     } else {
//         res.status(404).json({ message: 'Cart not found' });
//     }
// };

const GetAllItem = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(404).json({ message: 'Invalid user ID' });
    }

    try {
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart is Empty' });
        }

        res.status(201).json(cart.products);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
};


const RemoveItem = async (req, res) => {
    const { userId, productId } = req.params;

    if (userId) {
        try {
          const cart = await Cart.findOne({ user: userId });
    
          if (!cart) {
            return res.status(400).json({ error: 'Cart not found' });
          }
    
          const productIndex = cart.products.findIndex(
            (product) => product.product.toString() === productId
          );
    
          if (productIndex === -1) {
            return res.status(400).json({ error: 'Product not found in cart' });
          }
    
          cart.products.splice(productIndex, 1);
          await cart.save();
    
          res.json({ success: true, cart, message: 'Product removed from cart' });
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      }
    else {
        const cart = req.session.cart || [];
        res.json({ success: true, json: cart, message: 'Product removed from cart' })
        const productIndex = cart.findIndex((product) => product.productId === productId)
        if (productIndex === -1) {
            return res.status(400).json({ error: 'product not found in cart' });
        }
        const product = cart[productIndex];
        cart.splice(productIndex, 1);
        req.session.cart = cart;
        res.json({ success: true, message: 'Product removed from cart' })
    }
}

const CheckoutVnPay = async (req, res) => {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var config = require('config');

    var tmnCode = config.get('vnp_TmnCode');
    var secretKey = config.get('vnp_HashSecret');
    var vnpUrl = config.get('vnp_Url');
    var returnUrl = config.get('vnp_ReturnUrl');

    var date = new Date();

    var createDate = moment(date).format('YYYYMMDDHHmmss');
    var orderId = moment(date).format('DDHHmmss');
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    
    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    var currCode = 'USD';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.redirect(vnpUrl)
}

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
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

module.exports = {
    AddToCart,
    RemoveItem,
    GetAllItem,
    CountCart,
    CheckoutVnPay
}