require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const Admin = require('../../models/Admin');


const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email })

        if(admin && (await bcrypt.compare(password, admin.password)))
        {
            const accessToken = jwt.sign({
                admin: {
                    email: admin.email,
                    id: admin.id,
                }
            }, 
            process.env.ACCESS_TOKEN_ADMIN,
            { expiresIn: "5m" }
            )
            res.status(201).json({ accessToken })
        }
        else
        {
            res.status(401).json({ message: "Email or password admin account is not correct" })
        }

    } catch (error) {
        res.status(500).json({ message: "have error " + error });
    }
};

const currentToken = async (req, res) => {
    res.status(201).json({ json: req.user });
}

module.exports = {
    AdminLogin,
    currentToken
}