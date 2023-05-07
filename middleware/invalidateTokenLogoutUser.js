const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient();

const checkBlacklist = async (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        const token = authToken.split(" ")[1];

        client.get(token, (err, reply) => {
            if (err) throw err;
            if (reply === 'blacklisted') {
                return res.status(401).json({ message: "Token has been blacklisted" });
            }
            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Error checking token blacklist: " + error });
    }
};

module.exports = {
    checkBlacklist,
};