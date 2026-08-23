const express = require("express");
require('dotenv').config();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: process.env.id,
    clientSecret: process.env.sec,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/dashboard.html");
    }
);
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5, 
    message: { error: "Too many requests. Try again later." }
});
app.use("/api/", apiLimiter);
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ error: "Unauthorized" });
}
app.get("/api/weather/:city", isAuthenticated, async (req, res, next) => {
    try {
        const { city } = req.params;
        const API_KEY = process.env.openweatherapikey;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        res.json(response.data);
    } catch (error) {
        next(error);
    }
});
app.use((err, req, res, next) => {
    console.error(`[Error Log]: ${err.stack}`);

    const status = err.response ? err.response.status : 500;
    const message = err.response 
        ? (err.response.data.message || "External API Error") 
        : "Internal Server Error";

    res.status(status).json({
        error: {
            message: message,
            status: status
        }
    });
});
app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});
app.listen(5000, () => console.log("Server running on http://localhost:5000"));