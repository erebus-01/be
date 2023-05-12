const User = require("../../models/Users");
const VerifyPassUser = require("../../models/VerifyPassUser");
const validator = require('email-validator');
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.APP_ID
    }
});

const sendVerifyCodePass = async (req, res) => {
    const email = req.body.email;
    const verificationCode = generateVerificationCode();

    const user = await User.findOne({ email: email });
    try {
        if (user) {
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: 'One-time verification code',
                html: `
                    <p>This is the verification code used to authenticate your account before you can change your password</p>
                    <p>Your verification code is: ${verificationCode} </p>
                `
            };
        
            const newUniqueVerify = new VerifyPassUser({
                userId: user.id,
                verifyCode: verificationCode,
                createAt: Date.now(),
                expireAt: Date.now() + 90000
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
                res.status(500).json({ message: 'Could not save verification email' })
            });
        }
        else
        {            
            res.status(500).json({ message: 'Email has not been registered in our system' })
        }
    }
    catch(error) {res.status(500).json({ error: error.message }) };
}

function generateVerificationCode() {
    const length = 6;
    const charset = '0123456789';
    let verificationCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      verificationCode += charset[randomIndex];
    }
    return verificationCode;
}

const CheckVerifyCode = async (req, res) => {
    const verifyCode = req.body.verify;
    const userId = req.params.id;

    try {
        await VerifyPassUser.find({ userId, verifyCode })
        .then((result) => {
            if(result.length > 0) {
                const expiresAt = result[0];
    
                if(expiresAt < Date.now())
                {
                    VerifyPassUser
                    .deleteOne({ userId, verifyCode })
                    .then(() => {
                        res.status(400).json({ message: 'Your verification code has expired' })
                    })
                    .catch(() => res.status(400).json({ message: 'An error occurred' }))
                }
                else {
                    VerifyPassUser
                    .deleteOne({ userId, verifyCode })
                    .then(() => {
                        res.status(400).json({ message: 'Your verification code is valid' })
                    })
                    .catch(() => res.status(400).json({ message: 'An error occurred' }))
                }
            }
            else {
                res.status(400).json({ message: "Incorrect code" })
            }
        })
    } catch(error) {res.status(500).json({ error: error.message }) };
}

const ChangePassUser = async (req, res) => {
    const userId = req.params.id;
    const { password, cfpassword } = req.body;

    try {
        if(password !== cfpassword) {
            return res.status(400).json({ message: 'Two passwords do not match' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        await User.findByIdAndUpdate({ _id: userId }, { password: hashedPassword }, {new: true })
        .then(() => {
            res.status(200).json({ message: 'Your password change successfully' });
        })
        .catch(error => res.status(500).json({ error: error.message }));
    } catch(error) {res.status(500).json({ error: error.message }) };
}

module.exports = {
    sendVerifyCodePass,
    CheckVerifyCode,
    ChangePassUser
};