const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
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
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  address: {
    type: String,
    require: true
  },
  wards: {
    type: String,
    require: true
  },
  districts: {
    type: String,
    require: true
  },
  provinces: {
    type: String,
    require: true
  },
  payment: {
    type: String,
    require: true
  },
  statusPayment: {
    type: String,
    require: true,
    default: "Thanh toan khi nhan hang"
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;