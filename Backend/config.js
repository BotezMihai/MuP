const Sequelize = require('sequelize');

// PARAMS: BD+USER+PASS
module.exports = new Sequelize('mup', 'mihai', '1234', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        useUTC: false, // for reading from database
      },
      timezone: '+02:00', // for writing to database
}); 

