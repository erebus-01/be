const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    verify: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

CustomerSchema.pre('save', async function (next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;