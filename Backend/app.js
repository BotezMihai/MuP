const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const db = require('./config.js');
const Sequelize = require('sequelize');
const socket = require('socket.io');

const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/uploads");
const eventRoutes = require("./routes/events");
const userPartyRoutes = require("./routes/UserParty");
const manageRoutes = require("./routes/manage");


app.use(bodyParser.urlencoded({ extended: true }));
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
app.use("/upload", uploadRoutes);
app.use("/event", eventRoutes);
app.use("/party", userPartyRoutes);
app.use("/manage", manageRoutes);
app.use(express.static('pages'));

app.listen(5000, () => console.log('Server started on port 5000'));

// var io = socket(server);

// io.on('connection', function (socket) {
//     console.log("made socket connection");

// });

// const WebSocket = require('ws')

// const wss = new WebSocket.Server({
//   port: 8081,
// });
// var i = 0;
// wss.on('connection', ws => {
//   ws.on('message', message => {
//     console.log(`Received message => ${message}`)
//     ws.send(i);
//     i = i + 1;
//   })
//   // ws.send('Ce faci boy?!')
//   // setInterval(() => { ws.send(i); i = i + 1;  }, 1000);
// })




