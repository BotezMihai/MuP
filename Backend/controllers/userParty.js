const UserPartyModel = require("../models/participanti");
const config = require("../config");
const bd = require("sequelize");
const UserParty = UserPartyModel(config, bd);


exports.join_party = (req, res) => {
    UserParty.create({
        id_user: req.userData.userID,
        id_petrecere: req.body.id_petrecere

    }).then(result => {
        return res.status(201).json({
            message: "Join ok",
            code: "201"
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({
            message: "Server error",
            code: "500"
        })
    })
};

exports.get_parties = async (req, res) => {
    var id_user = req.userData.userID;
    var results = await config.query(`select * from participanti pa join petreceri pe on pa.id_petrecere=pe.id where
                                    pa.id_user= :id `, { replacements: { id: id_user }, type: config.QueryTypes.SELECT, raw: true })
    if (results.length == 0) {
        return res.status(404).json({
            message: "No parties",
            code: "404"
        });
    }
    else {
        return res.status(200).json({
            message: results,
            code: "200"
        });
    }
};

exports.delete_party = (req, res) => {
    var id = req.query.id;
    UserParty.destroy(
        { where: { id_user: req.userData.userID, id_petrecere: id } },
        { truncate: true }
    ).then(result => {
        res.status(200).json({
            message: "Deleted successfully"
        })
    }
    ).catch(err => console.log(err))

}

