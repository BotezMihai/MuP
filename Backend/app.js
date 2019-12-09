const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const db = require('./config.js');
const Sequelize = require('sequelize');

const userRoutes = require("./routes/user");
const uploadRoutes=require("./routes/uploads");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


app.use("/user", userRoutes);
app.use("/upload",uploadRoutes);


app.listen(5000, () => console.log('Server started on port 5000'));