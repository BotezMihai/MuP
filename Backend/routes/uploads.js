const express = require("express");
const router = express.Router();

const checkAuth = require(__dirname + './../middleware/checkAuth');
const checkTimeAndLocation = require(__dirname + './../middleware/timeLocation');
const UploadsController = require('../controllers/upload');


router.post("/song", checkAuth, UploadsController.upload_song);
router.post("/style", checkAuth, UploadsController.upload_style);
router.get("/timeLocation/:latitudine/:longitudine", checkAuth, UploadsController.time_location);

module.exports = router;
