require("dotenv")
const express = require('express');
const connectDB = require('./config/ConnectionMongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv').config();
const app = express();
const cors = require('cors');
const passport = require("passport");


const PORT = process.env.PORT || 5000;

require('./config/passportGoogleAuth20')(passport)

app.use(cors({
  origin: ['http://localhost:9000', 'http://localhost:3000'],
  methods: 'GET,POST,DELETE,PUT',
  allowedHeaders: 'Content-Type, Authorization'
}));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
  })
)


app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
connectDB();

app.use("/", require('./routes/CustomerRoute'));
app.use("/auth/v1/", require('./routes/AdminRoute'));

app.listen(PORT, console.log(`Server listening on ${PORT}`))