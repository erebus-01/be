const mongoose = require('mongoose');

const productColorSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    images: [{
        type: String,
        require: true
    }],
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {timestamps: true});

const ProductColor = mongoose.model('ProductColor', productColorSchema);

module.exports = ProductColor;