const express = require("express");
const router = express.Router();

const checkAuth = require(__dirname + './../middleware/checkAuth');
const YoutubeController = require('../controllers/youtube');

router.get("/get-song",checkAuth,YoutubeController.get_new_song);


module.exports=router;