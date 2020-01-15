const express = require("express");
const router = express.Router();

const checkAuth = require(__dirname + './../middleware/checkAuth');
const UserPartyController = require('../controllers/userParty');

router.get("/get-parties",checkAuth,UserPartyController.get_parties);
router.post("/join-party", checkAuth, UserPartyController.join_party);
router.delete("/delete-party", checkAuth, UserPartyController.delete_party);

module.exports=router;