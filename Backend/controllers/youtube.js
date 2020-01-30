const config = require("../config");
const bd = require("sequelize");

const PlayingModel = require("../models/playing");
const Playing = PlayingModel(config, bd);

const DansatoriModel = require("../models/dansatori");
const Dansatori = DansatoriModel(config, bd);

const YoutubeModel = require("../models/youtube");
const Youtube = YoutubeModel(config, bd);

const MelodiiModel = require("../models/melodii");
const Melodii = MelodiiModel(config, bd);

const TagModel = require("../models/tag");
const Tag = TagModel(config, bd);

const { google } = require('googleapis');
const fetch = require('node-fetch');

var key = 'AIzaSyARFBpQYS5QVNDB_Sgtzl_YvIdd4yUtmCk';
var query = 'lady gaga';
function get_time_now() {
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
        + ('0' + (currentdate.getMonth() + 1)).slice(-2) + "-"
        + ('0' + currentdate.getDate()).slice(-2) + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    console.log(datetime);
    return datetime;
}
async function get_youtube_id(singer_name) {

    var response = await fetch(encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${singer_name}
    &type=video&videoCategoryId=10&order=relevance&
    &key=${key}`));
    var json = await response.json();
    return json;
    // console.log(json.items[0].id);
}
async function search_new_song(res, id_petrecere, stil) {
    console.log(stil.stil);
    const URL_TOP_ARTISTS = encodeURI(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${stil.stil}&api_key=4d7c7783c33be71fec00763625260dc8&format=json`);
    var results = await fetch(URL_TOP_ARTISTS);
    var json = await results.json();
    var results_youtube = await Youtube.findAll({
        where: { id_petrecere: id_petrecere }
    });
    for (let element of json.topartists.artist) {
        var ids = await get_youtube_id(element.name);
        console.log(ids.items);
        for (let id of ids.items) {
            var id_found = await Youtube.findOne({
                where: { id_video: id.id.videoId }
            });
            if (id_found == null) {
                var insert=await Youtube.create({
                    id_video: id.id.videoId,
                    id_petrecere: id_petrecere
                });
                return res.json({
                    message: id.id.videoId,
                    code: "200"
                });
            }
        }
        break;
    }
    // console.log(json.topartists.artist);


}
exports.get_new_song = async (req, res) => {
    var id_petrecere = req.params.id_petrecere;
    var results = await Youtube.findAll({
        where: { id_petrecere: id_petrecere }
    });
    var results_stiluri = await config.query(`select stil from stiluri s where s.id_petrecere=${id_petrecere}`, { type: config.QueryTypes.SELECT, raw: true });
    const nr_elements = results_stiluri.length;
    let random_nr = Math.floor(Math.random() * Math.floor(nr_elements));
    let stil = results_stiluri[random_nr];
    let new_song = await search_new_song(res, id_petrecere, stil);

}