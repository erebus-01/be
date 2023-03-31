const express = require('express');
const passport = require('passport');

const Login = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})

const Logout = async (res, req, next) => {
    req.logout(),
    res.redirect('/');
}

module.export = {
    Login,
    Logout
}