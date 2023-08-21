var express = require('express');
var router = express.Router();
var express = require('express');
// var app = express();
var http = require('http');
var server = http.createServer(router);
var socketIO = require('socket.io');
const io = socketIO(server)
PORT = 3000;
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join('../','public/index.html'));
});
router.use(express.static(path.join(__dirname, "../", "public/index.html")));
var users = new Map(); 
io.on('connection', (socket) => { 
  users.set(socket.id, socket.user);
  socket.on('join')
  socket.on('message', (msg) => {
    console.log(msg);
  })
});
//disconnection 
io.on('disconnect', () => {
  users.remove(socket.id);
  console.log('disconnected');
  // emit users list after user gets logged out
})

module.exports = router;
