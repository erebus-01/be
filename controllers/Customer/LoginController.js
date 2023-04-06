const user = require('../../models/Users')

const Login = async (res, req, next) => {


    const cart = req.session.cart || [];
    for(const {productId, quantity} of cart)
    {
        await cart.create({
            user: user._id,
            quantity: productId,
            quantity
        });
    }
    req.session.cart = null;
    res.json({ user })

}