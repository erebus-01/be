require("dotenv")
const express = require('express');
const connectDB = require('./config/ConnectionMongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv').config();
const app = express();


const PORT = process.env.PORT || 5000;

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
  })
)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
connectDB();

app.use("/", require('./routes/CustomerRoute'));
app.use("/auth/v1/", require('./routes/AdminRoute'));

app.listen(PORT, console.log(`Server listening on ${PORT}`))