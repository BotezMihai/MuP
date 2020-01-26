const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const db = require('./config.js');
const Sequelize = require('sequelize');
const cors=require('cors');
const socket = require('socket.io');
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/uploads");
const eventRoutes = require("./routes/events");
const userPartyRoutes = require("./routes/UserParty");
const manageRoutes = require("./routes/manage");
const statisticRoutes=require("./routes/statistic");

const mySocket=require("./controllers/websocket");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.use("/user", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/event", eventRoutes);
app.use("/party", userPartyRoutes);
app.use("/manage", manageRoutes);
app.use("/statistic",statisticRoutes);
app.use("/uploads",express.static('uploads'));
app.use(express.static('pages'));
app.use(express.static('scripts'));
app.use(express.static('images'));


app.listen(5000, () => console.log('Server started on port 5000'));
