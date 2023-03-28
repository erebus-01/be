const mongoose = require('mongoose')
const OrderSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        requre: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        require: true
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }]
}, {timestamps: true})

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order