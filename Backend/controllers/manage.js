const config = require("../config");
const bd = require("sequelize");

const MelodiiModel = require("../models/melodii");
const Melodii = MelodiiModel(config, bd);

const MelodiiUserModel = require("../models/melodii_user");
const MelodiiUser = MelodiiUserModel(config, bd);

const StiluriModel = require("../models/stiluri");
const Stiluri = StiluriModel(config, bd);

const TagModel = require("../models/tag");
const Tag = TagModel(config, bd);

const PlayingModel = require("../models/playing");
const Playing = PlayingModel(config, bd);

const DansatoriModel = require("../models/dansatori");
const Dansatori = DansatoriModel(config, bd);


async function get_stiluri_desc(id) {
    var results = await Stiluri.findAll({
        attributes: ['stil', [bd.fn(('count'), bd.col("stil")), "nr"]],
        group: ['stil', 'id_petrecere'],
        having: { id_petrecere: { [bd.Op.eq]: id } },
        order: bd.literal('nr DESC'),
        raw: true
    });
    return results;
}

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

async function id_songs_used_party(id_party) {
    var melodii_playlist = await Playing.findAll({
        where: { id_petrecere: { [bd.Op.eq]: id_party } },
        raw: true
    });
    var id_songs_used = [];
    for (let i = 0; i < melodii_playlist.length; i++) {
        id_songs_used.push(melodii_playlist[i].id_melodie);
    }
    return id_songs_used;
}

async function search_new_song(res, id_melodie, id_petrecere) {

    var results_info_song = await config.query(`select * from melodii_user inner join melodii on melodii_user.titlu_melodie=melodii.titlu 
                                    inner join tag on tag.id_melodie=melodii.id where melodii.id=:id_melodie and melodii_user.id_petrecere=:id_petrecere`,
        { replacements: { id_melodie: id_melodie, id_petrecere: id_petrecere }, type: config.QueryTypes.SELECT, raw: true });
    console.log(results_info_song);
    var id_songs_used = await id_songs_used_party(id_petrecere);
    var result_info_songs_unused = await config.query(`select * from melodii_user inner join melodii on melodii_user.titlu_melodie=melodii.titlu 
    inner join tag on tag.id_melodie=melodii.id where melodii.id not in (:ids) and melodii_user.id_petrecere=:id_petrecere`,
        { replacements: { ids: id_songs_used, id_petrecere: id_petrecere }, type: config.QueryTypes.SELECT, raw: true }
    );
    console.log(result_info_songs_unused);
    // cautare dupa stilul melodiei cu cei mai multi dansatori
    for (let i = 0; i < results_info_song.length; i++) {
        let tag = results_info_song[i].tag;
        for (let j = 0; j < result_info_songs_unused.length; j++) {
            console.log("compar", tag.trim(), result_info_songs_unused[j].tag.trim());
            if (result_info_songs_unused[j].tag.trim() === tag.trim()) {
                var datetime = get_time_now();
                var result_insert = await Playing.create({
                    id_melodie: result_info_songs_unused[j].id_melodie,
                    id_petrecere: id_petrecere,
                    start: datetime
                });
                return res.status(200).json({
                    message: result_info_songs_unused[j]
                });
            }
        }
    }
    // caut dupa stilurile de la utilizatori
    var style = await get_stiluri_desc(id_petrecere);
    console.log(style);
    for (let i = 0; i < style.length; i++) {
        let tag = style[i].stil;
        for (let j = 0; j < result_info_songs_unused.length; j++) {
            if (tag.trim() === result_info_songs_unused[j].tag.trim()) {
                var datetime = get_time_now();
                var result_insert = await Playing.create({
                    id_melodie: result_info_songs_unused[j].id_melodie,
                    id_petrecere: id_petrecere,
                    start: datetime
                });
                return res.status(200).json({
                    message: result_info_songs_unused[j]
                });
            }
        }
    }
    var result_info_songs_unused_left_join = await config.query(`select * from melodii_user left join melodii on melodii_user.titlu_melodie=melodii.titlu 
    left join tag on tag.id_melodie=melodii.id where melodii.id not in (:ids) and melodii_user.id_petrecere=:id_petrecere`,
        { replacements: { ids: id_songs_used, id_petrecere: id_petrecere }, type: config.QueryTypes.SELECT, raw: true }
    );
    // returnez o melodie care nu i s a mai dat play
    if (result_info_songs_unused_left_join.length != 0) {
        var datetime = get_time_now();
        var result_insert = await Playing.create({
            id_melodie: result_info_songs_unused_left_join[0].id_melodie,
            id_petrecere: result_info_songs_unused_left_join[0].id_petrecere,
            start: datetime
        });
        return res.status(200).json({
            message: result_info_songs_unused_left_join[0]
        });
    } else {
        return res.status(404).json({
            message: "No more songs",
            code: "404"
        });
    }
}

// parametrii id_petrecere
exports.get_new_song = async (req, res) => {
    var id_petrecere = req.params.id_petrecere;
    var playList = await Playing.findAll({
        where: { id_petrecere: { [bd.Op.eq]: id_petrecere } },
        raw: true
    });
    if (playList.length == 0) {
        // prima melodie din playlist
        var style = await get_stiluri_desc(id_petrecere);
        console.log(style);
        var result_info_songs_unused = await config.query(`select * from melodii_user inner join melodii on melodii_user.titlu_melodie=melodii.titlu 
    inner join tag on tag.id_melodie=melodii.id where melodii_user.id_petrecere=:id_petrecere`,
            { replacements: { id_petrecere: id_petrecere }, type: config.QueryTypes.SELECT, raw: true }
        );
        for (let i = 0; i < style.length; i++) {
            let tag = style[i].stil;
            for (let j = 0; j < result_info_songs_unused.length; j++) {
                if (tag.trim() === result_info_songs_unused[j].tag.trim()) {
                    var datetime = get_time_now();
                    var result_insert = await Playing.create({
                        id_melodie: result_info_songs_unused[j].id_melodie,
                        id_petrecere: id_petrecere,
                        start: datetime
                    });
                    return res.status(200).json({
                        message: result_info_songs_unused[j]
                    });
                }
            }
        }
        if (result_info_songs_unused.length != 0) {
            var datetime = get_time_now();
            var result_insert = await Playing.create({
                id_melodie: result_info_songs_unused[0].id_melodie,
                id_petrecere: id_petrecere,
                start: datetime
            });
            return res.status(200).json({
                message: result_info_songs_unused[0]
            });
        }
        return res.status(404).json({
            message: "No songs",
            code: "404"
        });
    }
    else {
        //cand am cel putin o melodie in playlist ul petrecerii curente
        console.log("sunt aici");
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
}

