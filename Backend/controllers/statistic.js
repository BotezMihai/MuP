const config = require("../config");

exports.get_statistic = async (req, res) => {

    console.log("test statistic");
    var results = await config.query(`SELECT d.id_user, sum(d.durata) as durata, t.tag from dansatori d
    join playing p on d.id_playing=p.id
    join melodii m on m.id=p.id_melodie
    join tag t on m.id=t.id_melodie
    group by d.id_user,t.tag, p.id_petrecere
    having d.id_user=:id_user;`,
        { replacements: { id_user:req.userData.userID }, type: config.QueryTypes.SELECT, raw: true });
    return res.json({
        message: results,
        code: "200"
    });
}