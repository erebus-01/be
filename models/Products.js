const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    subtitles: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    benefit: [{
        type: String,
        require: true
    }],
    price: {
        type: Number,
        required: true
    },
    colors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductColor',
        default: []
    }]
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;