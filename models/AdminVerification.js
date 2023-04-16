const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminVerificationSchema = new mongoose.Schema({
    adminId: String,
    uniqueString: String,
    createdAt: Date,
    expireAt: Date
});

const AdminVerification = mongoose.model('AdminVerification', AdminVerificationSchema);

module.exports = AdminVerification;