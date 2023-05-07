const User = require("../../models/Users");

const validator = require('email-validator');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const {v4: uuidv4} = require('uuid');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.APP_ID
    }
});


const sendVerificationEmail = ({_id, email}, res) => {
    const currentUrl = "http://localhost:5000";
    const uniqueString = uuidv4() + _id;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Verify your email address',
        html: `
            <p>Verify your email to complete the account creation process</p>
            <p>Please click the link below to verify your email address: <a href="${currentUrl}/verify/${_id}/${uniqueString}">here</a></p>
        `
    };

    const saltEmail = 10;
    bcrypt.hash(uniqueString, saltEmail)
    .then((hashUniqueString) => {
        const newUniqueVerify = new UserVerification({
            userId: _id,
            uniqueString: hashUniqueString,
            createAt: Date.now(),
            expireAt: Date.now() + 180000
        })

        newUniqueVerify
        .save()
        .then(() => {
            transporter
            .sendMail(mailOptions)
            .then(() => {
                res.status(201).json({ message: 'Verification email sent' })
            })
            .catch((error) => {
                res.status(500).json({message: 'Send verification email failed'})
            })
        })
        .catch((error) => {
            res.status(500).json({message: 'Could not save verification email'})
        });
    })
    .catch(() => {
        res.status(500).json({message: 'An error occurred while hashing your email'})
    })
}
