const Order = require('../../models/Orders')

const GetAll = async (req, res, next) => {
    try {
        Order.find({})
            .then(orders => res.status(201).json({ json: orders }))
            .catch(error => res.status(500).json({ error: error.message }));
    } catch (error) {
        res.status(500).json({ json: error });
    }
}

const ChangeStatus = async (req, res, next) => {
    const { userId, orderId } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
    
        order.status = status;
    
        await order.save();
    
        res.json(order);
    } catch (error) {
        res.status(500).json({ json: error });
    }
}

const GetOrderUser = async (req, res, next) => {
    const { userId } = req.params;
    const { status } = req.query;

    try {
        let query = { user: userId };

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query);

        if (orders.length === 0) {
            return res.status(404).json({ error: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    GetAll,
    ChangeStatus,
    GetOrderUser
}