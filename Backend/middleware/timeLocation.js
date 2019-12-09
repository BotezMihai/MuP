const geolib = require('geolib');
// nu e terminat
module.exports = (req, res, next) => {

    console.log(geolib.getDistance(
        { latitude: 47.1561626, longitude: 27.604742 },
        { latitude: 47.1561093, longitude: 27.6068763 }
    ));
    let time_now = Date.now();
    d1 = new Date("01-01-1998");//timpul eventului
    if (time_now - d1.getTime < 15 * 60 * 1000) {
        return res.status(400).json({
            message: "Nu poti uploada inca melodii"
        })
    }
    next();
}