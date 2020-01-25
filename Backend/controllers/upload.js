const geolib = require('geolib');
const formidable = require('formidable')
const path = require('path')
const mm = require('music-metadata');
const util = require('util');
const fetch = require('node-fetch');

const MelodiiUserModel = require("../models/melodii_user");
const config = require("../config");
const bd = require("sequelize");
const MelodiiUser = MelodiiUserModel(config, bd);

const MelodiiModel = require("../models/melodii");
const Melodii = MelodiiModel(config, bd);

const TagModel = require("../models/tag");
const Tag = TagModel(config, bd);

const StiluriModel = require("../models/stiluri");
const Stiluri = StiluriModel(config, bd);

const PetreceriModel = require("../models/petreceri");
const Petreceri = PetreceriModel(config, bd);

const ParticipantiModel = require("../models/participanti");
const Participanti = ParticipantiModel(config, bd);

async function insert_new_song(title, artist, duration, song, album, id_petrecere, tag, an = '-') {
    var inserted_row = await Melodii.create({
        titlu: title,
        artist: artist,
        durata: duration,
        path: song,
        album: album,
        id_petrecere: id_petrecere,
        an: an
    });
    var inserted_row_tag = await Tag.create({
        id_melodie: inserted_row.id,
        tag: tag
    });
}

// de schimbat raza si ora din time_location
exports.upload_style = async (req, res) => {
    // numele din formularul html
    const { style } = req.body;
    // const style = ['rock', 'pop'];
    var data = [];
    for (let el of style) {
        let l = {};
        l['stil'] = el;
        l['id_user'] = req.userData.userID;
        l['id_petrecere'] = req.user_party;
        data.push(l);
    }
    var results = await Stiluri.bulkCreate(data);
}

exports.upload_song = async (req, res) => {
    console.log("sunt aici");
    var field = {};
    var song;
    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on('fileBegin', function (name, file) {
        // eventual concatenez cu .mp3
        console.log("aici file begin");
        file.path = path.join(__dirname, '../uploads/' + file.name);
    });

    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
        song = path.join(__dirname, "../uploads/" + file.name);
    });

    form.on('field', function (name, value) {
        field[name] = value;
    });

    form.on("end", function () {
        mm.parseFile(song)
            .then(metadata => {
                console.log(util.inspect(metadata, { showHidden: false, depth: null }));
                console.log(req.userData.userID);
                console.log(metadata.common.title);

                MelodiiUser.create({
                    id_user: req.userData.userID,
                    titlu_melodie: metadata.common.title,
                    id_petrecere: field['id_petrecere']
                }).then(async (result) => {

                    const API_KEY = "4d7c7783c33be71fec00763625260dc8";
                    var title = metadata.common.title;
                    let duration = metadata.format.duration;
                    var artist = null;
                    var track_name = null;
                    var album = '-';
                    var genre = null;
                    if (title.search("–") > 0) {
                        let split_array = title.split("–");
                        artist = split_array[0];
                        track_name = split_array[1];
                    }
                    else if ('artist' in metadata.common) {
                        artist = metadata.common.artist;
                        track_name = metadata.common.title;
                    }
                    if ('album' in metadata.common) {
                        album = metadata.common.album;
                    }
                    if ('genre' in metadata.common) {
                        let arr = metadata.common.genre[0];
                        let first_genre = arr.split(';')[0];
                        try {
                            await insert_new_song(title, artist, duration, song, album, field['id_petrecere'], first_genre);
                        }
                        catch (error) {
                            return res.json({
                                message: "Insert successfully"
                            });
                        }
                        return res.json({
                            message: "Insert successfully"
                        });
                    }
                    try {
                        if (artist !== null && title !== null) {
                            const URL_GET_INFO_TRACK = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" + API_KEY + "&artist=" + artist + "&track=" + title + "&format=json";
                            var response = await fetch(encodeURI(URL_GET_INFO_TRACK));
                            var json = await response.json();
                            console.log(json.track.toptags.tag[0].name, "??????");
                            try {
                                var genre = json.track.toptags.tag[0].name;
                                if (album === '-') {
                                    album = json.track.album.title;
                                }
                                var an = json.track.wiki.published;

                            } catch (error) {
                                console.log('Nu s a gasit genul, albumul, anul!!!');
                            }
                            try {
                                await insert_new_song(title, artist, duration, song, album, field['id_petrecere'], genre, an);
                                return res.json({
                                    message: "Insert successfully"
                                });
                            } catch (err) {
                                return res.json({
                                    message: "Insert successfully"
                                });
                            }
                        }
                        const URL_SEARCH = "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + title + "&api_key=" + API_KEY + "&format=json";
                        var response = await fetch(encodeURI(URL_SEARCH));
                        var json = await response.json();
                        if (artist == null)
                            artist = json.results.trackmatches.track[0].artist;
                        let name = json.results.trackmatches.track[0].name;
                        const URL_TOP_TAGS = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=" + artist + "&api_key=" + API_KEY + "&format=json";
                        response = await fetch(encodeURI(URL_TOP_TAGS));
                        json = await response.json();
                        try {
                            await insert_new_song(name, artist, duration, song, album, field['id_petrecere'], json.toptags.tag[0].name, an);
                        }
                        catch (err) {
                            return res.json({
                                message: "Insert successfully"
                            });
                        }
                        return res.json({
                            message: "Insert successfully"
                        });

                    } catch (err) {
                        console.log(err);
                        console.log("Nu s-au gasit date folosind api-ul");
                        Melodii.create({
                            titlu: track_name,
                            artist: artist,
                            durata: duration,
                            path: song,
                            id_petrecere: field['id_petrecere']
                        }).then(result => {
                            return res.json({
                                message: "Insert successfully without extern data"
                            });
                        }).catch(err => {
                            return res.json({
                                message: "Insert successfully without extern data"
                            });
                        })
                    }
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
}
// lungimea <=1000 de m si ora <=15 minute
exports.time_location = async (req, res) => {
    var latitudineURL=req.params.latitudine;
    var longitudineURL=req.params.longitudine;
    Petreceri.hasMany(Participanti, {
        foreignKey: 'id_petrecere'
    });
    Participanti.belongsTo(Petreceri, {
        foreignKey: 'id_petrecere'
    });
    try {
        var results = await Participanti.findAll({
            include: [{
                model: Petreceri,
                required: true
            }],
            where: {
                id_user: req.userData.userID
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Database error",
            code: "500"
        })
    };
    var time_now = new Date();
    var datetime = (time_now.getMonth() + 1) + "/"
        + time_now.getDate() + "/"
        + time_now.getFullYear() + " "
        + time_now.getHours() + ":"
        + time_now.getMinutes() + ":"
        + time_now.getSeconds();
    time_now = new Date(datetime);

    for (let i = 0; i < results.length; i++) {
        var date_event = results[i].petreceri.data.split(" ");
        var date = date_event[0].split("-");
        var time = date_event[1];
        var new_date = date[1] + '/' + date[0] + '/' + date[2] + ' ' + time;
        date_event = new Date(new_date);
        let time_difference=date_event-time_now;
        if (time_difference>=15 * 60000) {
            console.log("Nu e inca timpul potrivit");
            return res.status(400).json({
                message: "Nu poti uploada inca melodii",
                code: "400"
            })
        }
        else {
            var latitude = results[i].petreceri.dataValues.latitudine
            var longitude = results[i].petreceri.dataValues.longitudine;
            let event_location = { "latitude": latitude, "longitude": longitude };
            console.log(event_location);
            let my_location = { "latitude": latitudineURL, "longitude": longitudineURL };
            var distance = geolib.getDistance(event_location, my_location);
            console.log(distance);
            if (distance < 1000) {
                req.user_party = results[i].petreceri.dataValues.id;
                return res.status(200).json({
                    id_party: results[i].petreceri.dataValues.id
                });
            }
        }
    }
    return res.status(400).json({
        message: "Nu poti uploada inca melodii",
        code: "400"
    });
}