const express = require("express");
const router = express.Router();

const checkAuth = require(__dirname + './../middleware/checkAuth');
const checkTimeLocation = require(__dirname + './../middleware/timeLocation');
const manageController = require('../controllers/manage');


router.get("/new-song", checkAuth, checkTimeLocation, manageController.get_new_song);

module.exports = router;
