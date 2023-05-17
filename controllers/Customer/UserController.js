const User = require('../../models/Users');
const UserVerification = require("../../models/UserVerification");
const Cart = require("../../models/Cart");

const validator = require('email-validator');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient();

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

const VerifyUser = async (req, res, next) => {
    let { userId, uniqueString } = req.params;

    UserVerification
    .find({ userId: userId })
    .then((result) => {
        if(result.length > 0)
        {
            const expiresAt = result[0];
            const hashUniqueString = result[0].uniqueString;

            if(expiresAt < Date.now()) {
                UserVerification
                .deleteOne({ userId: userId })
                .then(() => {
                    User
                    .deleteOne({ _id: userId })
                    .then(() => {
                        res.status(400).json({ message: 'Please sign up again' })
                    })
                    .catch((error) => {
                        res.status(400).json({ message: 'Cleaning user with expired error occurred' })
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
                        User.updateOne({ _id: userId }, {verify: true})
                        .then(() => {
                            UserVerification
                            .deleteOne({ userId: userId})
                            .then(()=> {
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
        res.status(400).json({msg: `An error occurred in find UserVerification ${error}`})
    })
}

const SignUp = async (req, res, next) => {
    try{
        const { firstName, lastName, username, email, password, cfpassword } = req.body;
        const isValid = validator.validate(email);

        if(!isValid) return res.status(400).json({ message: 'Email not illegal' });

        if(password != cfpassword) return res.status(400).json({ message: 'Password and confirm password do not match' });

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "Email already existed."});

        const user = await User({ firstName, lastName, username, email, password });
        await user
        .save()
        .then((result) => {
            sendVerificationEmail(result, res)
        })
        .catch((error) => {
            res.status(400).json({ message: "Can't save admin account.", json: error });
        });

    }catch(error)
    {
        next(err);
        res.status(500).json({ json: error });
    }
}

const SignIn = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({ email, verify: true });

        if(user && await bcrypt.compare(password, user.password)) 
        {
            const accessToken = jwt.sign(
                {
                    user: {
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        id: user.id,
                    }
                },
                process.env.ACCESS_TOKEN_USER,
                { expiresIn: "5m" }
            )
            res.status(201).json({ accessToken })
        }
        else
        {
            res.status(401).json({ message: "Incorrect account information or email unconfirmed account" })
        } 

    }catch(error)
    {
        res.status(500).json({ message: "have error " + error });
    }
}

const currentToken = async (req, res) => {
    const cart = req.session.cart || [];
    const userId = req.session.user.id;
  
    if (cart.length > 0) {
        try {
            let userCart = await Cart.findOne({ user: userId });
    
            if (!userCart) {
            userCart = await Cart.create({ user: userId, products: [] });
            }
    
            cart.forEach((item) => {
                const existingProduct = userCart.products.find(
                    (product) => product.product.toString() === item.productId
                );
        
                if (existingProduct) {
                    existingProduct.quantity += item.quantity;
                } else {
                    userCart.products.push({
                    product: item.productId,
                    quantity: item.quantity,
                    });
                }
            });
    
            await userCart.save();
            req.session.cart = [];
    
                res.status(201).json({ json: userCart, message: "Add to cart from session" });
            } catch (error) {
                res.status(500).json({ message: "Error adding cart from session: " + error });
        }
    } else {
        try {
            const user = await User.findById(userId).select("-password");
            res.status(200).json({ json: user });
        } catch (error) {
            res.status(500).json({ message: "Error getting user information: " + error });
        }
    }
  };
  
const CheckSession = async (req, res) => {
    try {
        const session = req.session.user
        if (session) {
            res.status(200).json(session);
        } else {
            res.status(400).json();
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging out: " + error });
    }
}

const Logout = async (req, res) => {
    try {
        if (req.session.user) {
            delete req.session.user;
            res.status(200).json({ message: "Logout successful" });
        } else {
            res.status(400).json({ message: "User not logged in" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging out: " + error });
    }
};
  
module.exports = {
    SignUp,
    SignIn,
    VerifyUser,
    currentToken,
    Logout,
    CheckSession
}