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

const wss = new WebSocket.Server({
    port: 8085,
});
module.exports.reset = function (msg, callback) {
    return wss.on("connection", function (ws) {
      ws.send(msg, callback);
      ws.on("close", function () {
        console.log("websocket connection close")
      })
    })
  };
function get_time_now() {
    var currentdate = new Date();
    // var datetime = currentdate.getDate() + "/"
    //     + (currentdate.getMonth() + 1) + "/"
    //     + currentdate.getFullYear() + " "
    //     + currentdate.getHours() + ":"
    //     + currentdate.getMinutes() + ":"
    //     + currentdate.getSeconds();

    var datetime = currentdate.getFullYear() + "-" +
        (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime;
}

wss.on('connection', (ws, req) => {
    ws.on('message', async message => {
        console.log(message);
        var messageSplit = message.split(',');
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
            var id_playing = results[results.length-1].id; 
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
    });
});