const Admin = require('../../models/Admin');
const AdminVerification = require('../../models/AdminVerification');
const validator = require('email-validator');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.APP_ID
    }
});

const sendVerificationEmail = ({_id, email}, res) => {
    const currentUrl = "http://localhost:5000/auth/v1/admin";
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
        const newUniqueVerify = new AdminVerification({
            adminId: _id,
            uniqueString: hashUniqueString,
            createdAt: Date.now(),
            expireAt: Date.now() + 21600000
        })

        newUniqueVerify
            .save()
            .then(() => {
                transporter
                    .sendMail(mailOptions)
                    .then(() => {
                        res.status(201).json({msg: 'Verification email sent'})
                    })
                    .catch((error) => {
                        res.status(500).json({msg: 'Send verification email failed'})
                    })
            })
            .catch((error) => {
                res.status(500).json({msg: 'Could not save verification email'})
            })
            ;
    })
    .catch(() => {
        res.status(500).json({msg: 'An error occurred while hashing your email'})
    })
}

const VerifyAdmin = async (req, res, next) => {
    let { adminId, uniqueString } = req.params;

    AdminVerification
        .find({ adminId: adminId })
        .then((result) => {
            if(result.length > 0) {
                const expiresAt = result[0];
                const hashUniqueString = result[0].uniqueString;

                if(expiresAt < Date.now()) {
                    AdminVerification
                    .deleteOne({ adminId: adminId })
                    .then(result => {
                        Admin
                            .deleteOne({ adminId })
                            .then(() => {
                                res.status(400).json({ message: 'Please sign up again' })
                            })
                            .catch((error) => {
                                res.status(400).json({ message: 'Cleaning admin with expired error occurred' })
                            })
                        
                    })
                    .catch((error) => { res.status(400).json({ message: `An error occurred in delete AdminVerification ${error}` }) })
                }
                else
                {
                    bcrypt.compare(uniqueString, hashUniqueString)
                    .then(result => {
                        if(result) 
                        {
                            Admin.updateOne({ _id: adminId }, {verify: true})
                                .then(() => {
                                    AdminVerification
                                        .deleteOne({ adminId: adminId })
                                        .then(() => {
                                            res.status(400).json({ message: 'Your account is ready' })
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ message: "Can/'t delete AdminVerification error occurred" })
                                        })
                                })
                        }
                        else
                        {
                            res.status(400).json({ message: 'Invalid verification details passed.' })
                        }
                    })
                    .catch((error) => {
                        res.status(400).json({ message: 'An error occurred while compare unique' })
                    })
                }
            }
            else
            {
                res.status(400).json({ message: 'Please sign up again' })
            }
        })
        .catch((error) => {
            res.status(400).json({msg: `An error occurred in find AdminVerification ${error}`})
        })
}

const GetAllAdmin = async (req, res, next) => {
    try{
        const admins = await Admin.find({})
        res.status(200).send({success: true, json: admins})
    }
    catch(error)
    {
        res.status(500).json({msg: error})
    }
}   

const GetAdmin = async (req, res, next) => {
    let id = req.params.id;
    await Admin.findById({_id: id})
            .then((admin) => {
                res.status(201).json({ json: admin });
            })
            .catch((error) => {
                res.status(500).json({ message: error });
            })
}

const InsertAdmin = async (req, res, next) => {
    try{
        const { firstName, lastName, email, address, telephone, password, cfpassword } = req.body;

        const isValid = validator.validate(email);

        if (!isValid) {
            return res.status(400).json({ message: 'Email not illegal' });
        }

        if(password !== cfpassword)
        {
            return res.status(400).json({ message: 'Password and confirm password do not match' });
        }

        const exstingUser = await Admin.findOne({email});
        if(exstingUser)
        {
            return res.status(400).json({message: "Email already existed."});
        }
        const admin = new Admin({ firstName, lastName, email, address, telephone, password });
        await admin
            .save()
            .then((result) => {
                sendVerificationEmail(result, res)
            })
            .catch((error) => {
                res.status(400).json({ message: "Can't save admin account.", json: error });
            });
    } catch(err)
    {
        next(err);
        res.status(500).json({ message: err });
    }
}

const UpdateAdmin = async (req,res) => {
    const id = req.params.id;
    const { firstName, lastName, email, address, telephone } = req.body;

    Admin.findByIdAndUpdate(id, { firstName, lastName, email, address, telephone }, { new: true })
        .then(AdminInfor => {
        res.status(201).json({ message: "Update successfully", json: AdminInfor });
        }).catch(err => {
            res.status(500).json({ message: err.message });
        });
}

const DeleteAdmin = async (req, res, next) => {
    try {
        const {id} = req.params;

        await Admin.findByIdAndDelete(id);

        res.status(201).json({ message: "Admin account deleted successfully" });
    }catch(err)
    {
        next(err);
        res.status(500).json({ message: err });
    }
}

module.exports =  {
    GetAllAdmin,
    GetAdmin,
    InsertAdmin,
    UpdateAdmin,
    VerifyAdmin,
    DeleteAdmin
}