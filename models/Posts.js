const mongoose = require('mongoose')
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    topic: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    }
}, {timestamps: true})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post