const bd = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const UserModel = require("../models/user");
const config = require("../config");

const User = UserModel(config, bd);

// Register function
exports.user_register = (req, res) => {
    User.findAll({
        where: {
            email: req.body.email
        }
    }).then(users => {

        if (users.length >= 1) {
            return res.status(409).json({
                message: "Mail exists"
            });
        } else {
            bcrypt.hash(req.body.parola, 10, (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Error at creating the user"
                    });
                }
                else {
                    User.create({
                        nume: req.body.nume,
                        prenume: req.body.prenume,
                        email: req.body.email,
                        parola: hash

                    }).then(result => {
                        return res.json({
                            message: "Insert successfully"
                        });
                    }).catch(err => {
                        return res.status(500).json({
                            message: err
                        })
                    })
                }
            })
        }
    });
};

// Login function
exports.user_login = (req, res) => {
    User.findAll({
        where: {
            email: req.body.email
        }
    }).then(users => {
        if (users.length < 1) {
            res.status(404).json({
                code: 404,
                message: "Not found"
            })
        } else {
            bcrypt.compare(req.body.parola, users[0].parola, (err, result) => {
                if (err) {
                    return res.status(400).json({
                        message: "Authentification failed"
                    })
                }
                if (result) {
                    const private_key = fs.readFileSync(__dirname + './../private.key', 'utf8');
                    const token = jwt.sign({
                        email: users[0].email,
                        userID: users[0].id
                    },
                        private_key,
                        {
                            expiresIn: "10h"
                        })
                    return res.status(200).json({
                        token: token
                    })
                } else {
                    return res.status(400).json({
                        message: "Wrong password"
                    })
                }
            })
        }
    })
}

// Delete user
exports.user_delete = (req, res) => {
    User.destroy(
        { where: { email: req.userData.email } },
        { truncate: true }
    ).then(result => {
        res.status(200).json({
            message: "Deleted successfully"
        })
    }
    )
}

