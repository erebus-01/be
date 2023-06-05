const mongoose = require('mongoose')
const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    require: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    color: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }]
}, { timestamps: true })

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart