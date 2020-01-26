const config = require("../config");
const bd = require("sequelize");

const PlayingModel = require("../models/playing");
const Playing = PlayingModel(config, bd);

const DansatoriModel = require("../models/dansatori");
const Dansatori = DansatoriModel(config, bd);

const YoutubeModel = require("../models/youtube");
const Youtube = YoutubeModel(config, bd);

const { google } = require('googleapis');
const fetch = require('node-fetch');
var youtubeV3 = google.youtube({ version: 'v3', auth: 'AIzaSyDKEXCYmy4rvAhOb8RV4R5Tyhntg4T3nwg' });
var key = 'AIzaSyDKEXCYmy4rvAhOb8RV4R5Tyhntg4T3nwg';
var query = 'lady gaga';
async function get_youtube_id(singer_name) {

    var response = await fetch(encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${singer_name}
    &type=video&videoCategoryId=10&order=relevance&
    &key=${key}`));
    var json = await response.json();
    return json;
    // console.log(json.items[0].id);
}
async function search_new_song(res, id_melodie, id_petrecere) {
    var results_info_song = await config.query(`select * from melodii_user left join melodii on melodii_user.titlu_melodie=melodii.titlu 
    left join tag on tag.id_melodie=melodii.id where melodii.id=:id_melodie and melodii_user.id_petrecere=:id_petrecere`,
        { replacements: { id_melodie: id_melodie, id_petrecere: id_petrecere }, type: config.QueryTypes.SELECT, raw: true });
    const URL_TOP_ARTISTS = encodeURI(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${results_info_song[0].tag}&api_key=4d7c7783c33be71fec00763625260dc8&format=json`);
    var results = await fetch(URL_TOP_ARTISTS);
    var json = await results.json();
    var results_youtube = await Youtube.findAll({
        where: { id_petrecere: id_petrecere }
    });
    for (let song of json.topartists.artist) {
        // console.log(song.name);
        var youtube = await get_youtube_id(song.name);
        // for (let element of youtube) {
        //     let result = results_youtube.filter(element => {
        //         return element.indexOf(element.videoId) !== -1;
        //     })
        //     console.log(result);
        // }
        console.log(youtube);

    }
    // console.log(results_info_song[0].tag);
    // console.log(json.topartists.artist);

}
exports.get_new_song = async (req, res) => {
    var id_petrecere = req.body.id_petrecere;
    console.log("?????????????????????????", id_petrecere);
    Playing.hasMany(Dansatori, { foreignKey: 'id_playing' });
    Dansatori.belongsTo(Playing, { foreignKey: 'id_playing' });
    var results = await Playing.findAll({
        include: [Dansatori],
        attributes: { include: [[bd.fn(('count'), bd.col("start")), "nr"]] },
        group: ['id_petrecere', 'id_melodie'],
        order: bd.literal('nr DESC'),
        where: { id_petrecere: id_petrecere },
        raw: true
    });
    console.log(results);
    var new_song = await search_new_song(res, results[0].id_melodie, id_petrecere);


}