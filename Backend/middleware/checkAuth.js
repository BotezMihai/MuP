const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = (req, res, next) => {
    try {
        res.header('Access-Control-Allow-Origin','*')
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        const token = req.headers.authorization.split(" ")[1];
        const private_key = fs.readFileSync(__dirname + './../private.key', 'utf8');
        const decoded = jwt.verify(token, private_key);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};