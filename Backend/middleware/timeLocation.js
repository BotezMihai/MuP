const geolib = require('geolib');

const config = require("../config");
const bd = require("sequelize");

const PetreceriModel = require("../models/petreceri");
const Petreceri = PetreceriModel(config, bd);

const ParticipantiModel = require("../models/participanti");
const Participanti = ParticipantiModel(config, bd);
// primesc locatia, verific daca este vreo petrecere la care user-ul a dat join si daca da
// verificam daca acesta e in raza petrecerii si daca e si ora potrivita

module.exports = async (req, res) => {
    console.log("Sunt in middleware");
    console.log(req.files);
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
        if (date_event - time_now >= 1500 * 60000) {
            console.log("Nu e inca timpul potrivit");
            return res.status(400).json({
                message: "Nu poti uploada inca melodii",
                code: "400"
            })
        }
        else {
            console.log("E ok");
            var latitude = results[i].petreceri.dataValues.latitudine
            var longitude = results[i].petreceri.dataValues.longitudine;
            console.log(latitude, longitude);
            let event_location = { "latitude": latitude, "longitude": longitude };
            console.log(event_location);
            let my_location = { "latitude": req.body.latitude, "longitude": req.body.longitude };
            console.log("?????????", req.body.latitude);
            console.log(event_location, my_location);
            var distance = geolib.getDistance(event_location, my_location);
            console.log(distance);
            if (distance < 1000) {
                req.user_party = results[i].petreceri.dataValues.id;
                console.log("if locatie");
                return next();
            }
        }
    }
    return res.status(400).json({
        message: "Nu poti uploada inca melodii",
        code: "400"
    })
}