const UserPartyModel = require("../models/petreceri");
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

exports.get_parties = (req, res) => {
    UserParty.findAll({
        where: {
            id_user: req.userData.userID
        }
    }).then(result => {
        if (result.length == 0) {
            return res.status(404).json({
                message: "No parties",
                code: "404"
            })
        }
        return res.status(200).json(result);

    }).catch(err => console.log(err));
};

exports.delete_party = (req, res) => {
    var id = req.query.id;
    console.log("aici");
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

