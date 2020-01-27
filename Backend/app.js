const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const db = require('./config.js');
const Sequelize = require('sequelize');
const cors = require('cors');
const socket = require('socket.io');
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/uploads");
const eventRoutes = require("./routes/events");
const userPartyRoutes = require("./routes/UserParty");
const manageRoutes = require("./routes/manage");
const statisticRoutes = require("./routes/statistic");
const youtubeRoutes = require("./routes/youtube");
const mySocket = require("./controllers/websocket");

const PartyModel = require("./models/petreceri");
const Party = PartyModel(db, Sequelize);

var corsOptions = {
  origin: '*',
  credentials: true
};
var schedule = require('node-schedule');
app.use(cors(corsOptions));
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
app.use("/statistic", statisticRoutes);
app.use("/youtube", youtubeRoutes);
var j = schedule.scheduleJob('0 0 0/5 ? * * *',async function () {

  var deleted = await db.query(`delete from petreceri where  DATE_ADD(str_to_date(data,'%d-%m-%Y %H : %i'), INTERVAL 10 HOUR) < now();`)
app.use("/statistic",statisticRoutes);
app.use("/uploads",express.static('uploads'));
app.use(express.static('pages'));
app.use(express.static('scripts'));
app.use(express.static('images'));


});
app.listen(5000, () => console.log('Server started on port 5000'));
