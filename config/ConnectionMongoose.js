const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const db = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB: ", mongoose.connection.host, mongoose.connection.name);
    }catch(e)
    {
        console.log(e);
        process.exit(1);
    }
}

module.exports = connectDB;