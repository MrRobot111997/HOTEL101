const express = require('express');
const passport = require('passport');
const {
    checkAuth
} = require('../middleware');
const router = express.Router();

const {
    registerForm,
    registerUser,
    loginUser,
    loginForm,
    logoutUser
} = require("../controller/user")

router.route("/register")
    .get(registerForm)
    .post(registerUser);

router.route("/login")
    .get(loginForm)
    .post(passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }), loginUser);


router.get("/logout", checkAuth, logoutUser);

module.exports = router;