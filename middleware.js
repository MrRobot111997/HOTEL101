const {
    hotelSchema,
    reviewSchema
} = require('./schemas');
const ExpressError = require("./utils/ExpressError");
const Hotel = require("./models/hotel");

module.exports.checkAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be Signed In !!!');
        return res.redirect("/login");
    }
    next();
}


module.exports.isAuthor = async (req, res, next) => {
    const {
        id
    } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel.author.equals(req.user._id)) {
        req.flash('error', "Only Author has that Permission.");
        return res.redirect(`/hotels/${id}`);
    }
    next();
}


module.exports.validateHotel = (req, res, next) => {
    const {
        error
    } = hotelSchema.validate(req.body);

    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    next();
};


module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewSchema.validate(req.body);
    // console.log(error);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    next();
};