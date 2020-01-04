
const PartyModel = require("../models/petreceri");
const config = require("../config");
const bd = require("sequelize");
const Party = PartyModel(config, bd);

exports.create_party = (req, res) => {
    Party.create({
        id_user: req.userData.userID,
        latitudine: req.body.latitudine,
        longitudine: req.body.longitudine,
        nume: req.body.nume,
        data: req.body.data
    }).then(result => {
        return res.status(201).json({
            status: "201",
            message: "OK"
        }).catch(err => {
            return res.status(500).json({
                status: "500",
                message: "Error"
            })
        });
    })
}

exports.delete_party =async (req, res) => {
    var my_party = await Party.findAll(
        { where: { id_user: req.userData.userData } }
    );
    if (my_party.length != 0) {
        Party.destroy(
            { where: { id: req.body.id } },
            { truncate: true }
        ).then(result => {
            res.status(200).json({
                status: "200",
                message: "Deleted successfully"
            })
        });
    }
    return res.status(400).json({
        status: "400",
        message: "It's not your party"
    });
}

exports.get_parties = (req, res) => {
    Party.findAll({}).then(parties => {
        return res.status(200).json({
            party: parties
        });
    })
}

exports.put_party = async (req, res) => {
    var my_party = await Party.findAll(
        { where: { id_user: req.userData.userData } }
    );
    if (my_party.length != 0) {
        var rows_to_update = {};
        if (req.body.nume != null)
            rows_to_update['nume'] = req.body.nume;
        if (req.body.data != null)
            rows_to_update['data'] = req.body.data;
        if (req.body.latitudine != null)
            rows_to_update['latitudine'] = req.body.latitudine;
        if (req.body.longitudine != null)
            rows_to_update['longitudine'] = req.body.longitudine;

        Party.update(
            rows_to_update,
            { where: { id_user: req.userData.userID, id: req.body.idPetrecere } }
        ).then(affectedRows => {
            return res.status(201).json({
                status: "201",
                message: "Modified ok"
            })
        })
    }
    return res.status(400).json({
        status: "400",
        message: "It's not your party"
    });
}