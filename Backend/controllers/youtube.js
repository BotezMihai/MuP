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
async function search_new_song(res, id_melodie, id_petrecere) {
    var results_info_song = await config.query(`select * from melodii_user left join melodii on melodii_user.titlu_melodie=melodii.titlu 
    left join tag on tag.id_melodie=melodii.id where melodii.id=:id_melodie and melodii_user.id_petrecere=:id_petrecere`,
        { replacements: { id_melodie: id_melodie, id_petrecere: id_petrecere }, type: config.QueryTypes.SELECT, raw: true });
    console.log(results_info_song);
    const URL_TOP_ARTISTS = encodeURI(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${results_info_song[0].tag}&api_key=4d7c7783c33be71fec00763625260dc8&format=json`);
    var results = await fetch(URL_TOP_ARTISTS);
    var json = await results.json();
    var results_youtube = await Youtube.findAll({
        where: { id_petrecere: id_petrecere }
    });
    var found = false;
    for (let song of json.topartists.artist) {
        var youtube = await get_youtube_id(song.name);
        for (let element of youtube.items) {
            found = false;
            for (let row of results_youtube) {
                if (element.id.videoId == results_youtube.id_video) {
                    found = true;
                    break;
                }
            }
            if (found == false) {
                var created_youtube = await Youtube.create({
                    id_video: element.id.videoId,
                    tag: results_info_song[0].tag,
                    id_petrecere: id_petrecere
                });
                var datetime = get_time_now();
                var created_playing = await Playing.create({
                    id_youtube: element.id.videoId,
                    start: datetime,
                    id_petrecere: id_petrecere
                })
                return res.json({
                    message: element.id.videoId,
                    code: "200"
                });
            }
        }
        break;
    }
}
exports.get_new_song = async (req, res) => {
    var id_petrecere = req.params.id_petrecere;
    var results = await Youtube.findAll({
        where: { id_petrecere: id_petrecere }
    });
    if (results.length == 0) {
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
    //     console.log(results[0].nr);
    //     var result_info_song = await config.query(`select * from melodii_user inner join melodii on melodii_user.titlu_melodie=melodii.titlu 
    // inner join tag on tag.id_melodie=melodii.id where melodii.id=:id_melodie and melodii_user.id_petrecere=:id_petrecere`,
    //         { replacements: { id_melodie: results[0].id_melodie, id_petrecere: id_petrecere }, type: config.QueryTypes.SELECT, raw: true });
    //     console.log(result_info_song[0].tag);
    //     for (let element of results) {
    //         let count = await config.query(`select count(*) from playing p join
    //             youtube y on p.id_youtube=y.id_video join dansatori d on p.id=d.id_playing where p.id_petrecere=${id_petrecere} and y.tag=${element.}
    //             group by y.id_video, y.tag by count(*) desc  `);
    //         console.log(count,"heheheheh");
    //     }
    //     // var new_song = await search_new_song(res, results[0].id_melodie, id_petrecere);
    }
    else {
        var x = 100;
    }


}