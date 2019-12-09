const geolib = require('geolib');
const formidable = require('formidable')
const path = require('path')
const mm = require('music-metadata');
const util = require('util');

const MelodiiUserModel = require("../models/melodii_user");
const config = require("../config");
const bd = require("sequelize");
const MelodiiUser = MelodiiUserModel(config, bd);


exports.upload_song = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        file.path = path.join(__dirname, '../uploads/' + file.name);
    });
    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
        let song = path.join(__dirname, "../uploads/" + file.name);
        mm.parseFile(song)
            .then(metadata => {
                console.log(util.inspect(metadata, { showHidden: false, depth: null }));
                console.log(req.userData.userID);
                console.log(metadata.common.title);

                MelodiiUser.create({
                    id_user: req.userData.userID,
                    titlu_melodie: metadata.common.title

                }).then(result => {
                    return res.json({
                        message: "Insert successfully"
                    });
                }).catch(err => {
                    return res.status(500).json({
                        message: err
                    })
                })
            })
            .catch(err => {
                console.error(err.message);
            });
    });
    form.on('error', err => {
        return res.status(500).json({
            message: "Eroare la incarcarea melodiei",
            code: "500"
        })
    })
}