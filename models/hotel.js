const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = mongoose.set('toJSON', { virtuals: true });

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/c_scale,w_0.35')
});

const HotelSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }, ],
} , opts);


HotelSchema.virtual( 'properties.popUpMarkup' ).get( function() {
  return `<a href = "/hotels/${this._id}">${this.title}</a>`
} );

HotelSchema.post("findOneAndDelete", async function (doc) {
  console.log(doc);

  /*      MY WAY
  for (let review of doc.reviews) {
    console.log(review._id);
    await Review.findByIdAndDelete(review._id);
  }
  */
  if (doc) {
    await Review.remove({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Hotel", HotelSchema);