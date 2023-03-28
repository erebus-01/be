const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    subtitles: {
        type: String,
        require: true
    },
    benefit: [{
        type: String,
        require: true
    }],
    price: {
        type: mongoose.Types.Decimal128,
        require: true
    },
    avatar: {
        Data: Buffer,
        require: true,
        contentType: String
    },
    slideImage: [{
        image: {
            type: String, 
            require: true
        },
        color: {
            type: String, 
            require: true
        },
        colorCode: {
            type: String, 
            require: true
        }
    }],
    content: {
        Data: Buffer,
        require: true,
    }
}, {timestamps: true})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product

