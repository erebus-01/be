const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    usename: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: string,
        require: true
    }
})

const Customer = mongoose.model('Customer', CustomerSchema)

module.export = Customer