const Joi = require("joi");

module.exports.hotelSchema = Joi.object({
  hotel: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    images: Joi.object({
      url: Joi.string().required(),
      filename: Joi.string().required()
    }),
  }).required(),
  deletetImages: Joi.object(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});