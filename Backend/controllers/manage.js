


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
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    console.log(datetime);
    return datetime;
}

exports.get_new_song = async (req, res) => {
    console.log("Sunt in manage controller");
    var playList = await Playing.findAll({
        where: { id_petrecere: { [bd.Op.eq]: req.body.id_petrecere } },
        raw: true
    });
    if (playList.length == 0) {
        var results = await get_stiluri_desc(req.body.id_petrecere);
        console.log(results[0].stil);
        var found = false;
        var contor = 0;
        Melodii.hasMany(Tag, { foreignKey: 'id_melodie' });
        Tag.belongsTo(Melodii, { foreignKey: 'id_melodie' });
        while (!found && contor < results.length) {
            var results_tag = await Tag.findAll({
                include: [Melodii],
                where: { tag: { [bd.Op.eq]: results[contor].stil } },
                raw: true
            })
            if (results_tag.length > 0) {
                var currentdate = new Date();
                var datetime = get_time_now();
                console.log(datetime);
                var result_insert = await Playing.create({
                    id_melodie: results_tag[0]['id_melodie'],
                    id_petrecere: results_tag[0]['melodii.id_petrecere'],
                    start: datetime
                });
                return res.json({
                    message: results_tag[0],
                    code: 200
                });
            }
        }
        console.log(results_tag);
    }

}