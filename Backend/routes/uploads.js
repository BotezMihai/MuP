const express = require("express");
const router = express.Router();

const checkAuth = require(__dirname + './../middleware/checkAuth');
const UploadsController = require('../controllers/upload');

const checkTimeAndLocation = require(__dirname + "./../middleware/timeLocation");

router.post("/song", checkAuth, UploadsController.upload_song);

module.exports = router;
