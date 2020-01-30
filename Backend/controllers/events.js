
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
// parametrul pe care il iau din query e id
exports.delete_party = async (req, res) => {
    var id = req.query.id;
    var my_party = await Party.findAll(
        { where: { id_user: req.userData.userID } }
    );
    if (my_party.length != 0) {
        Party.destroy(
            { where: { id: id } },
            { truncate: true }
        ).then(result => {
            res.status(200).json({
                status: "200",
                message: "Deleted successfully"
            })
        });
    }
    else
        return res.status(400).json({
            status: "400",
            message: "It's not your party"
        });
}

exports.get_parties = async (req, res) => {
    // Party.findAll({}).then(parties => {
    //     return res.status(200).json({
    //         party: parties
    //     });
    // })
    console.log(req.userData.userID);
    var parties=await config.query(`SELECT distinct pe.id,pe.nume, pe.latitudine, pe.longitudine, pe.data FROM petreceri pe where ${req.userData.userID} not in (select id_user from participanti pa where pe.id=pa.id_petrecere);`,
    {type: config.QueryTypes.SELECT, raw: true})
    return res.json({
        message: parties,
        code: "200"
    });
}
exports.get_my_parties =async (req, res) => {
    var my_party = await Party.findAll(
        { where: { id_user: req.userData.userID } }
    );
    if (my_party.length == 0) {
        return res.status(404).json({
            message: "Nu ai creat nicio petrecere pana in acest moment!",
            code: "404"
        })
    }
    else {
        return res.status(200).json({
            message: my_party
        });
    }

}

exports.put_party = async (req, res) => {
    var my_party = await Party.findAll(
        { where: { id_user: req.userData.userID } }
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