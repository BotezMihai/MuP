


const config = require("../config");
const bd = require("sequelize");

const MelodiiModel = require("../models/melodii");
const Melodii = MelodiiModel(config, bd);

const MelodiiUserModel = require("../models/melodii_user");
const MelodiiUser = MelodiiUserModel(config, bd);

const StiluriModel = require("../models/stiluri");
const Stiluri = StiluriModel(config, bd);

const TagModel = require("../models/tag");
const Tag = MelodiiModel(config, bd);

exports.get_new_song = (req, res) => {

    var istoric = [];
    console.log("Sunt in manage controller");


}