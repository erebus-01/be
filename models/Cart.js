const mongoose = require('mongoose')
const CartSchema = new mongoose.Schema({
    user: {
        type: mongose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    products: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }]
    ,
    quantity: Number
}, {timestamps: true})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart