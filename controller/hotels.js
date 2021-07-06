const Hotel = require("../models/hotel");
const catchAsync = require("../utils/catchAsync");

const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxgeocoding({
    accessToken: mapToken
});

const multer = require("multer")
var upload = multer({
    dest: 'uploads/'
})

const {
    hotelSchema
} = require("../schemas");
const {
    cloudinary
} = require("../cloudinary");
const {
    replaceOne
} = require("../models/hotel");



module.exports.index = async (req, res) => {
    const hotels = await Hotel.find({});
    res.render("hotels/index", {
        hotels: hotels
    });
};


module.exports.addHotel = catchAsync(async (req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.hotel.location,
        limit: 1
    }).send();


    const hotel = new Hotel(req.body.hotel);
    hotel.geometry = geoData.body.features[0].geometry;
    hotel.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));

    hotel.author = req.user._id;
    await hotel.save();
    console.log(req.files, hotel);
    req.flash('success', 'Successfully added a New Hotel.');
    res.redirect("/hotels/" + hotel._id);
});


module.exports.deleteHotel = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash("success", "Hotel Deleted Successfully.");
    res.redirect("/hotels");
});

module.exports.editForm = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) {
        req.flash('error', "This Hotel Doesn't Exists");
        return res.redirect("/hotels");
    }

    res.render("hotels/edit", {
        hotel: hotel
    });
});


module.exports.editHotel = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;

    const geoData = await geocoder.forwardGeocode({
        query: req.body.hotel.location,
        limit: 1
    }).send();

    const hotel = await Hotel.findByIdAndUpdate(id, {
        ...req.body.hotel
    }, {
        new: true
    });

    hotel.geometry = geoData.body.features[0].geometry;

    const newImages = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));

    if (req.body.hotel.deleteImages) {

        for (let img of req.body.hotel.deleteImages) {
            cloudinary.uploader.destroy(img);
        }

        await hotel.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.hotel.deleteImages
                    }
                }
            }
        });
    }

    await hotel.images.push(...newImages);
    await hotel.save();
    req.flash('success', "Successfully Updated Hotel Details");
    res.redirect("/hotels/" + id);

});

module.exports.showHotel = catchAsync(async (req, res) => {
    const data = await Hotel.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate('author');
    if (!data) {
        req.flash('error', 'Hotel Not Found!!!');
        return res.redirect('/hotels')
    }
    res.render("hotels/show", {
        hotel: data
    });
});