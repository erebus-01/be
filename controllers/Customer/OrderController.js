const Order = require('../../models/Orders')

const InsertOrder = async (req, res) => {
    const { products, total } = req.body;
    try {
        const order = await Order.create({
            user: req.user._id,
            products,
            total
        });
        res.status(201).json({ success: true, order });
    }catch (error){
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating order" });
    }
}

const GetOrderUser = async (req, res) => {
    try{
        const orders = await Order.find({ user: req.user._id }).populate('product');
        res.json({ success: true, orders });
    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message: 'Error getting orders' });
    }
}