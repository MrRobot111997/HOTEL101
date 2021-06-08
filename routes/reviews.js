const express = require("express");
const routes = express.Router({
  mergeParams: true
});

const methodOverride = require("method-override");
const {
  checkAuth,
  validateReview,
  isAuthor
} = require("../middleware");



const Hotel = require("../models/hotel");
const Review = require("../models/review");
const {
  addReview,
  deleteReview
} = require("../controller/reviews");


routes.post(
  "/",
  checkAuth,
  validateReview,
  addReview
);

routes.delete(
  "/:rid",
  deleteReview
);


module.exports = routes;