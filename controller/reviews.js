const catchAsync = require("../utils/catchAsync");
const Hotel = require("../models/hotel");
const Review = require("../models/review");

const {
    reviewSchema
} = require("../schemas");

module.exports.deleteReview = catchAsync(async (req, res) => {
    const {
        id,
        rid
    } = req.params;

    await Hotel.findByIdAndUpdate(id, {
        $pull: {
            reviews: rid
        }
    });
    await Review.findByIdAndDelete(rid);
    req.flash('success', 'Review Deleted Successfully.')
    res.redirect(`/hotels/${id}`);
});


module.exports.addReview = catchAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    hotel.reviews.push(review);
    await hotel.save();
    req.flash('success', 'Review Added Successfully.')
    res.redirect(`/hotels/${req.params.id}`);
});