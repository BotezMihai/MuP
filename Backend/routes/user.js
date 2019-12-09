const express = require("express");
const router = express.Router();
const checkAuth = require(__dirname + './../middleware/checkAuth');

const UserController = require('../controllers/user');
const UploadsController = require('../controllers/upload');

router.post("/register", UserController.user_register);

router.post("/login", UserController.user_login);

router.delete("/delete", checkAuth, UserController.user_delete);

module.exports = router;