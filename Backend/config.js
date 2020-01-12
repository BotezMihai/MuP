const Sequelize = require('sequelize');

// PARAMS: BD+USER+PASS
module.exports = new Sequelize('mup', 'ramona', '12345', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

