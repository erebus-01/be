const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    password: {
        type: String,
        require: true
    }
}, {timestamps: true});

AdminSchema.pre('save', async function (next){
    const admin = this;
    if(!admin.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(admin.password, salt);
    admin.password = hash;
    next();
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;