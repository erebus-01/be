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
        data: Buffer,
        contentType: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        require: true,
        default: Date.now
    },
})

const Post = mongoose.model('Post', PostSchema);

module.export = Post