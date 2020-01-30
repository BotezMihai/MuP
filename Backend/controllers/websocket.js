const WebSocket = require('ws')
var url = require('url');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require("../config");
const bd = require("sequelize");

const PlayingModel = require("../models/playing");
const Playing = PlayingModel(config, bd);
 
const DansatoriModel = require("../models/dansatori");
const Dansatori = DansatoriModel(config, bd);

const MelodiiModel = require("../models/melodii");
const Melodii = MelodiiModel(config, bd);

const MelodiiUserModel = require("../models/melodii_user");
const MelodiiUser = MelodiiUserModel(config, bd);

const StiluriModel = require("../models/stiluri");
const Stiluri = StiluriModel(config, bd);

const TagModel = require("../models/tag");
const Tag = TagModel(config, bd);

const wss = new WebSocket.Server({
    port: 8085,
});
function send_broadcasting(id_party) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send("RESET " + id_party);
        }
    });
}
function get_time_now() {
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-" +
        (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime;
}

// ce e mai jos tine de algoritmul de generare de noi melodii
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

function get_time_nowNS() {
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

async function search_new_song(ws, id_melodie, id_petrecere) {

    var results_info_song = await config.query(`select * from melodii  
                                    inner join tag on tag.id_melodie=melodii.id where melodii.id=:id_melodie and melodii.id_petrecere=:id_petrecere`,
        { replacements: { id_melodie: id_melodie, id_petrecere: id_petrecere }, type: config.QueryTypes.SELECT, raw: true });
    console.log(results_info_song);
    var id_songs_used = await id_songs_used_party(id_petrecere);
    var result_info_songs_unused = await config.query(`select * from melodii
    inner join tag on tag.id_melodie=melodii.id where melodii.id not in (:ids) and melodii.id_petrecere=:id_petrecere`,
        { replacements: { ids: id_songs_used, id_petrecere: id_petrecere }, type: config.QueryTypes.SELECT, raw: true }
    );
    console.log(result_info_songs_unused);
    // cautare dupa stilul melodiei cu cei mai multi dansatori!!!caut o melodie cu acelasi stil
    if (results_info_song.length != 0) {
        for (let i = 0; i < results_info_song.length; i++) {
            let tag = results_info_song[i].tag;
            for (let j = 0; j < result_info_songs_unused.length; j++) {
                console.log("compar", tag.trim(), result_info_songs_unused[j].tag.trim());
                if (result_info_songs_unused[j].tag.trim() === tag.trim()) {
                    var datetime = get_time_nowNS();
                    var result_insert = await Playing.create({
                        id_melodie: result_info_songs_unused[j].id_melodie,
                        id_petrecere: id_petrecere,
                        start: datetime
                    });
                    var message_to_sent = {
                        "reset": true,
                        "message": result_info_songs_unused[j]
                    };
                    var json = JSON.stringify(message_to_sent);
                    ws.send(json);
                    send_broadcasting(id_petrecere);
                    return 0;
                }
            }
        }
    } else {
        console.log("aici");
        var song = await config.query(`select * from melodii where id=:id_melodie`,
            { replacements: { id_melodie: id_melodie }, type: config.QueryTypes.SELECT, raw: true });
        for (let element of result_info_songs_unused) {
            if (element.artist.trim() == song[0].artist.trim()) {
                var message_to_sent = {
                    "reset": true,
                    "message": element
                };
                var json = JSON.stringify(message_to_sent);
                ws.send(json);
                send_broadcasting(id_petrecere);
                return 0;
            }
        }
        console.log("n am gasit!");
    }
    // caut dupa stilurile de la utilizatori
    var style = await get_stiluri_desc(id_petrecere);
    console.log(style);
    for (let i = 0; i < style.length; i++) {
        let tag = style[i].stil;
        for (let j = 0; j < result_info_songs_unused.length; j++) {
            if (tag.trim() === result_info_songs_unused[j].tag.trim()) {
                var datetime = get_time_nowNS();
                var result_insert = await Playing.create({
                    id_melodie: result_info_songs_unused[j].id_melodie,
                    id_petrecere: id_petrecere,
                    start: datetime
                });
                var message_to_sent = {
                    "reset": true,
                    "message": result_info_songs_unused[j]
                };
                var json = JSON.stringify(message_to_sent);
                ws.send(json);
                send_broadcasting(id_petrecere);
                return 0;
            }
        }
    }
    if (result_info_songs_unused.length != 0) {
        var datetime = get_time_nowNS();
        var result_insert = await Playing.create({
            id_melodie: result_info_songs_unused[0].id_melodie,
            id_petrecere: result_info_songs_unused[0].id_petrecere,
            start: datetime
        });
        var message_to_sent = {
            "reset": true,
            "message": result_info_songs_unused[0]
        };
        var json = JSON.stringify(message_to_sent);
        ws.send(json);
        send_broadcasting(id_petrecere);
        return 0;
    } else {
        var message_to_sent = {
            "reset": false,
            "message": "No more songs"
        };
        var json = JSON.stringify(message_to_sent);
        ws.send(json);
        send_broadcasting(id_petrecere);
        return 0;
    }
}

wss.on('connection', (ws, req) => {
    ws.on('message', async message => {
        // actualizez dansatorii
        if (message[0] == 'a' && message[1] == 'd') {
            console.log("actualizam dansatorul in bd");
            var new_message = message.substring(3);
            var messageSplit = new_message.split(',');
            const id_party = messageSplit[0];
            const total = messageSplit[1];
            var adr = req.url;
            var q = url.parse(adr, true);
            const token = q.query.token;
            var time_request = get_time_now();
            console.log(time_request);
            try {
                const private_key = fs.readFileSync(__dirname + './../private.key', 'utf8');
                const decoded = jwt.verify(token, private_key);
                var results = await Playing.findAll({
                    where: { start: { [bd.Op.lte]: bd.literal(`str_to_date('${time_request}','%Y-%m-%d %H:%i:%s')`) }, id_petrecere: { [bd.Op.eq]: id_party } },
                    raw: true
                });
                var id_playing = results[results.length - 1].id;
                try {
                    var resultsDansatori = await Dansatori.findOne({
                        where: { id_user: { [bd.Op.eq]: decoded.userID }, id_playing: { [bd.Op.eq]: id_playing } },
                        raw: true
                    })
                    if (resultsDansatori == null) {
                        var resultsInsertDansator = await Dansatori.create({
                            "id_user": decoded.userID,
                            "id_playing": id_playing,
                            "durata": total
                        });
                    } else {
                        let id = await Dansatori.update(
                            { durata: total },
                            { where: { id_user: decoded.userID, id_playing: id_playing } });
                    }
                } catch (error) {
                    console.log(error);
                }
            } catch (error) {
                console.log(error);
                ws.send("CODE: 400");
            }
        }
        // dam o melodie noua
        else if (message[0] == 'n' && message[1] == 's') {
            var new_message = message.substring(3);
            console.log(new_message);
            var adr = req.url;
            var q = url.parse(adr, true);
            const token = q.query.token;
            var id_petrecere = parseInt(new_message);
            try {
                const private_key = fs.readFileSync(__dirname + './../private.key', 'utf8');
                const decoded = jwt.verify(token, private_key);

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
                                var datetime = get_time_nowNS();
                                var result_insert = await Playing.create({
                                    id_melodie: result_info_songs_unused[j].id_melodie,
                                    id_petrecere: id_petrecere,
                                    start: datetime
                                });
                                var message_to_sent = {
                                    "reset": true,
                                    "message": result_info_songs_unused[j]
                                };
                                var json = JSON.stringify(message_to_sent);
                                ws.send(json);
                                send_broadcasting(id_petrecere);
                                return 0;
                            }
                        }
                    }
                    if (result_info_songs_unused.length != 0) {
                        var datetime = get_time_nowNS();
                        var result_insert = await Playing.create({
                            id_melodie: result_info_songs_unused[0].id_melodie,
                            id_petrecere: id_petrecere,
                            start: datetime
                        });
                        var message_to_sent = {
                            "reset": true,
                            "message": result_info_songs_unused[0]
                        };
                        var json = JSON.stringify(message_to_sent);
                        ws.send(json);
                        send_broadcasting(id_petrecere);
                        return 0;
                    }
                    var message_to_sent = {
                        "reset": false,
                        "message": "No songs"
                    };
                    var json = JSON.stringify(message_to_sent);
                    ws.send(json);
                    send_broadcasting(id_petrecere);
                    return 0;
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
                    var new_song = await search_new_song(ws, results[0].id_melodie, id_petrecere);
                    return 0;
                }
            } catch (error) {
                console.log(error);
                ws.send("CODE: 400");
            }
        } else {
            console.log(message);
        }
    });
});