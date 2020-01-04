const express = require("express");
const router = express.Router();
const checkAuth = require(__dirname + './../middleware/checkAuth');

const StatisticController = require('../controllers/statistic');


router.get("/me", checkAuth, StatisticController.get_statistic);

module.exports = router;