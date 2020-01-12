const express = require("express");
const router = express.Router();

const checkAuth = require(__dirname + './../middleware/checkAuth');
const EventsController = require('../controllers/events');

router.post("/add-party", checkAuth, EventsController.create_party);
router.delete("/delete-party", checkAuth, EventsController.delete_party);
router.get("/get-parties", checkAuth, EventsController.get_parties);
router.put("/modify-party", checkAuth, EventsController.put_party);


module.exports = router;

