const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    address: [{
        type: String,
        require: true
    }],
    telephone: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        require: true,
        default: Date.now
    }
})

const Admin = mongoose.model('Admin', AdminSchema)

module.exports = Admin