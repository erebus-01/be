const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
    let token;
    let authToken = req.headers.Authorization || req.headers.authorization

    if(authToken && authToken.startsWith("Bearer"))
    {
        token = authToken.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_USER, (err, decoded) => {
            if(err) res.status(400).json({ json: err })
            req.session.user = decoded.user;
            next();
        })

        if(!token) res.status(403).json({ message: "User is not authorized or timeout token." })
    }
    else
    {
        res.status(403).json({ message: "User is not authorized or timeout token." })
    }
}

module.exports = {
    validateToken
}

