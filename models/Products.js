const mongoose = require('mongoose');
const ProductColor = require('./productColorSchema');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    subtitles: {
        type: String,
        require: true
    },
    image: [
        {
        data: Buffer,
        contentType: String
        }
    ],
    description: {
            type: String,
            require: true
    },
    outstanding: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        required: true
    },
    colors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductColor'
    }]
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;