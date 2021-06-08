const express = require("express");
const router = express.Router({
  mergeParams: true
});


const multer = require("multer");
const {
  storage
} = require("../cloudinary");
var upload = multer({
  storage
});


const methodOverride = require("method-override");

const {
  checkAuth,
  isAuthor,
  validateHotel
} = require("../middleware");


const {
  index,
  addHotel,
  deleteHotel,
  editForm,
  editHotel,
  showHotel
} = require("../controller/hotels");


router.route("/")
  .get(index)
  .post(
    checkAuth,
    upload.array('hotel[images]'),
    // validateHotel,
    addHotel
  );

router.get("/new", checkAuth, (req, res) => {
  res.render("hotels/new");
});

router.route("/:id")
  .delete(
    checkAuth,
    isAuthor,
    deleteHotel
  )
  .get(
    showHotel
  )
  .put(
    isAuthor,
    upload.array('hotel[images]'),
    editHotel
  );

router.get("/:id/edit", checkAuth, isAuthor, editForm);

module.exports = router;