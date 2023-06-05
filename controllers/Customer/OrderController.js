const Order = require('../../models/Orders')
const Cart = require('../../models/Cart')

const createOrderFromCart = async (req, res) => {
    const id = req.params.idUser
    const { name, phone, address, wards, districts, provinces, price } = req.body
    try {
        const cart = await Cart.findOne({ user: id }).populate('products.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const order = new Order({
            user: cart.user,
            products: cart.products.map((item) => ({
                product: item.product,
                quantity: item.quantity,
                color: item.color,
            })),
            name, phone, address, wards, districts, provinces,
            payment: "Thanh toan khi nhan hang",
            totalPrice: price,
            status: 'Pending',
        });

        await order.save();

        cart.products = [];
        await cart.save();

        res.status(200).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const PaymentOrder = async (req, res) => {
    const id = req.params.idUser;
    const { name, phone, address, wards, districts, provinces, price } = req.body
    console.log(id)
    try {
        const cart = await Cart.findOne({ user: id }).populate('products.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const order = new Order({
            user: cart.user,
            products: cart.products.map((item) => ({
                product: item.product,
                quantity: item.quantity,
                color: item.color,
                name: item.name
            })),
            name, phone, address, wards, districts, provinces,
            payment: "Thanh toan online",
            statusPayment: "Thanh cong",
            totalPrice: price,
            status: 'Pending',
        });

        await order.save();

        cart.products = [];
        await cart.save();

        res.status(200).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const GetOrderUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('product');
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error getting orders' });
    }
}

module.exports = {
    createOrderFromCart,
    PaymentOrder,
    GetOrderUser
}