const User = require("../models/user");
const catchAsync = require("../utils/catchAsync")

module.exports.registerUser = catchAsync(async (req, res, next) => {
    try {
        const {
            email,
            username,
            password
        } = req.body.user;
        const user = new User({
            email,
            username
        });
        const newUser = await User.register(user, password);
        equal.login(newUser, (err) => {
            return next(err);
        });
        const redirectTo = req.session.returnTo || "/hotels";
        req.flash('success', "Welcome to Yelp Town, " + username);
        res.redirect(redirectTo);
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/register");
    }
});



module.exports.loginUser = async (req, res) => {
    const redirectTo = req.session.returnTo || "/hotels";
    req.session.returnTo = "/hotels";
    req.flash('success', "Welcome Back!!!");
    res.redirect(redirectTo);
};


module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', "Logged Out Successfully");
    res.redirect("/hotels");
};

module.exports.registerForm = (req, res) => {
    res.render("user/register");
};


module.exports.loginForm = (req, res) => {
    res.render("user/login");
};