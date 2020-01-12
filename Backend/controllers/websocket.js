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
    port: 8081,
});

wss.on('connection', (ws, req) => {
    ws.on('message', async message => {
        var messageSplit = message.split(',');
        const id_party = messageSplit[0];
        const id_melodie = messageSplit[1];
        const total = messageSplit[2];
        var adr = req.url;
        var q = url.parse(adr, true);
        const token = q.query.token;
        console.log(message);
        try {
            const private_key = fs.readFileSync(__dirname + './../private.key', 'utf8');
            const decoded = jwt.verify(token, private_key);
            var results = await Playing.findAll({
                where: { id_petrecere: { [bd.Op.eq]: id_party }, id_melodie: { [bd.Op.eq]: id_melodie } },
                raw: true
            });
            var id_playing = results[0].id;
            data.push(el);
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