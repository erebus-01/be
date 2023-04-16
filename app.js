const express = require('express');
const connectDB = require('./config/ConnectionMongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();


const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
connectDB();

app.use("/", require('./routes/CustomerRoute'));
app.use("/auth/v1/", require('./routes/AdminRoute'));

app.listen(PORT, console.log(`Server listening on ${PORT}`))