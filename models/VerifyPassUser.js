const mongoose = require('mongoose');

const VerifyPassUserSchema = new mongoose.Schema({
    userId: String,
    verifyCode: String,
    createdAt: Date,
    expireAt: Date
});

const VerifyPassUser = mongoose.model('VerifyPassUser', VerifyPassUserSchema);

module.exports = VerifyPassUser;