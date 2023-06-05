const GoogleUser = require("../models/GoogleUser");

var GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_GG_ID,
        clientSecret: process.env.CLIENT_GG_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
        scope: ['profile', 'email'],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await GoogleUser.findOne({ googleId: profile.id });
            if (existingUser) {
                return done(null, existingUser);
            } else {
                const newUser = new GoogleUser({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    verify: true,
                });
                const savedUser = await newUser.save();
                return done(null, savedUser);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const usergg = await GoogleUser.findById(id);
            done(null, usergg);
        } catch (err) {
            done(err);
        }
    })
};
