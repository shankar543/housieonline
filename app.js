var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io'); // Import Socket.io
const cors = require('cors'); // Import CORS middleware
const app = express();
const server = http.createServer(app); // Create HTTP server using Express app
const io = socketIo(server);
const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

let arr = [];
let interval = null;
var users = new Map();
class USER{
    constructor() {
        this.id = null;
        this.username = null,
            this.roomname = null;
    }
}
var size=0;
var set = new Set();

class Housie{
    constructor() {
        this.jaldi5completed = null,
    this.toplinecompleted= null,
    this.middlelinecompleted= null,
    this.bottomlinecompleted= null,
    this.housiecompleted= null    
    }
}

let rooms = {}

// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/socket.io.js', (req, res) => {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'routes', 'socket.io.js'));
});

function isSizeIncreased(num){
    let updated=false
    let updatedsetsize= set.add(num).size;
    if(size+1 === updatedsetsize){
        size = updatedsetsize
        updated=true;
    }
    return updated;
}

function getRandom(minimum,maximum){
    let min=Math.floor(minimum);
    let max=Math.ceil(maximum);
    return Math.floor(Math.random()*max-min+min);
}

function setOrder(){
    if (arr.length == 99) {
        return;
    }
    while (size <= 99) {
        let num=getRandom(1,100)
        if(isSizeIncreased(num)){
            if(num){
                arr.push(num);
            }
            }
    }
}
setOrder();
function displayCurrentNumber(roomname){
    let num = arr.shift();
    io.to(roomname).emit('displaycurrentnumber', num);
}
function start(roomname) {
console.log("started interval")
    if (rooms[roomname] && rooms[roomname].isGameStarted) {
        rooms[roomname].interval = setInterval(() => { displayCurrentNumber(roomname) }, 2000);
    } 

}
function stop(roomname) {
  console.log("stop the interval")
    if (rooms[roomname] && rooms[roomname].interval) {
        clearInterval(rooms[roomname].interval);
    }
}

    //jaldi5completed
        function housieUpdater(achievementname,roomname,id, username) {
            let obj = {};
            obj.userid = id;
            obj.username = username;
            console.log(achievementname);
            obj.isCompletd = true;
            achievementname = "" + achievementname;
     
            if (rooms[roomname] && !rooms[roomname].housie[achievementname]) {
                // rooms[roomname].housie={...rooms[roomname].housie,achievementname:obj}
                rooms[roomname].housie[achievementname] = username;
            }
}

io.on('connection', (socket) => {
    let user = new USER();
    socket.handshake.headers.origin = 'http://127.0.0.1:5500';
    user.id = socket.id;
    users.set(user.id, user);
    let datatoemit = JSON.stringify({ "usersonline": Array.from(users.values()) });
    console.log('rooms available',Object.keys(rooms).length)
    if (Object.keys(rooms).length) {
            io.to(socket.id).emit("availableRooms", {rooms})
    }

    io.emit("usersonline", datatoemit);

    socket.on("createroom", ({ roomname, username }) => {
        console.log('room created');
      let user = users.get(socket.id);
        if (!rooms[roomname]) {
            socket.join(roomname);
            user.roomname = roomname;
            user.username = username;
            user.isAdmin = true;
            rooms[roomname] = { admin: socket.id, adminname:username, players: [user], roomname: roomname, isGameStarted: false }
            rooms[roomname].housie = new Housie();
            users.set(socket.id, user);
            io.emit('roomcreated', {roomname, admin:username,rooms});            
        } else {
            io.to(socket.id).emit("msgfromserver", { msg: `${rooms[roomname]} all ready exist please try with some other room name` });
        }
    })
    
    socket.on("joinroom", ({ roomname, username }) => {
        let user = new USER();
        console.log(rooms[roomname],!rooms[roomname]?.isGameStarted)
            if (rooms[roomname] && !rooms[roomname]?.isGameStarted) {
                socket.join(roomname);
                user.id = socket.id;
                user.username = username;
                user.roomname = roomname;
                if(users.has(user.id)){
                    users.set(socket.id, user);
                }
                let currentRoomPlayers = rooms[roomname].players;
                if (!currentRoomPlayers.filter(player => player.id == socket.id).length) {
                    currentRoomPlayers.push(user);
                    rooms[roomname].players = currentRoomPlayers;
                }

                io.to(roomname).emit("playerjoined", { msg: `${username} joined the game in ${roomname} room`, roomname, currentRoomPlayers,username,rooms })
                
            } else {
                console.log("join from room is not working",rooms[roomname], !rooms[roomname]?.isGameStarted)
                socket.emit("msgFromserver", { msg: `${roomname} is unavailabale for joining ${username}` });
            }
           
        }); 
       
    socket.on('start', (roomname) => {
        if (rooms[roomname] && (socket.id === rooms[roomname].admin || rooms[roomname].isGameStarted)) {
        
      rooms[roomname].isGameStarted = true;
      io.to(rooms[roomname].roomname).emit("gamestarted");
        start(roomname);

    } else {
        io.to(socket.id).emit("msgfromserver",`only host ==> ${users.get(rooms[roomname]?.admin)?.username} can start the game ${users.get(socket.id)?.username}`)
    }
        });
    
    socket.on('resume', (roomname) => {
        console.log("resumesd the interval");
        if (rooms[roomname]?.isGameStarted) {
            start(roomname);
        }
    })
    socket.on('messageToRoom', ({ roomname, msg }) => {
        if (rooms[roomname] && rooms[roomname].isGameStarted) {
            io.to(roomname).emit("msgfromserver", msg);
        }
    })
    
    socket.on("message", data => {
        // console.log(data);
        socket.emit("data received");
      })
    
    socket.on("privatemessage", ({ user, message }) => {
        if (socket.id == user) {
            io.to(user).emit("msgFromserver", { msg: "you cannot send message to yourself" });
            return;
        }
        let sender = users.get(socket.id).username || socket.id
        
            io.to(user).emit("msgFromserver",{  msg:`${sender} sent you a message </br> ${message}` });
        });
        // socket.on("start", () => {
        //     start(socket);
        // });
        socket.on('stop', (roomname) => {
            stop(roomname);
        });
       
    socket.on("disconnect", () => {
        
           let user = users.get(socket.id);
           if (user) {
               let roomname = rooms[user?.roomname]?.roomname;
               io.to(roomname).emit("msgFromserver", `${user?.username} has disconnected from the game`);
        //    console.log(`${user.username || user.id} left the game`);
               rooms[roomname]?.players?.splice(rooms[roomname]?.players?.indexOf(user), 1);
               io.to(roomname).emit("playerjoined",{msg:`${user.username} left the game in ${roomname} room`,roomname,currentRoomPlayers:rooms[roomname]?.players})
               users.delete(socket.id);
               
               //    console.log(Array.from(users.values()))
               io.emit("usersonline", JSON.stringify({ "usersonline": Array.from(users.values()) }));
               if (!rooms[roomname]?.players?.length) {
                   delete rooms[roomname];
                  if (Object.keys(rooms).length) {
            io.to(socket.id).emit("availableRooms", {rooms})
                   }
               }
               if (rooms[roomname]?.admin == socket.id && !rooms[roomname]?.isGameStarted) {
                   delete rooms[roomname];
                   io.to(rooms[roomname].roomname).emit("msgFromserver", { msg: "admin disconnected please join some thher room" ,eventname:"admin_disconnected"})
                  if (Object.keys(rooms).length) {
            io.to(socket.id).emit("availableRooms", {rooms})
                   }
               }
           }
       });
        
    
        socket.on("jaldi5completed", ({  username,roomname }) => {
            housieUpdater("jaldi5completed", roomname, socket.id, username);
            console.log(username,roomname,'jaldi5')
            io.to(roomname).emit("msgFromserver", {msg:"jaldi 5 completed by" + username});
            io.to(roomname).emit("gamestatuschanged",rooms[roomname]?.housie);
               });
        socket.on("toplinecompleted", ({ roomname , username }) => {
            housieUpdater("toplinecompleted", roomname,socket.id, username);
            io.to(roomname).emit("gamestatuschanged", rooms[roomname]?.housie);
            io.to(roomname).emit("msgFromserver", {msg:"top line completed by" + username});
             });
        socket.on("middlelinecompleted", ({ roomname , username }) => {
            housieUpdater("middlelinecompleted",roomname, socket.id, username);
            io.to(roomname).emit("msgFromserver", {msg:"middle line completed by" + username});
            io.to(roomname).emit("gamestatuschanged", rooms[roomname]?.housie);
             });
        socket.on("bottomlinecompleted", ({ roomname , username }) => {
            housieUpdater("bottomlinecompleted", roomname,socket.id, username);
            io.to(roomname).emit("msgFromserver", {msg:"bottom line completed by" + username});
            io.to(roomname).emit("gamestatuschanged", rooms[roomname]?.housie);
            });
        socket.on("housiecompleted", ({ roomname , username }) => {
            housieUpdater("housiecompleted", roomname,socket.id, username);
            io.to(roomname).emit("gamestatuschanged", rooms[roomname]?.housie);
            io.to(roomname).emit("msgFromserver", {msg:"housie completed by" + username});
            delete rooms.roomname;
            if (Object.keys(rooms).length) {
                io.to(socket.id).emit("availableRooms", { rooms })
            }
            io.to(roomname).emit("endgame");
           
        });
    });
server.listen(5500, err => {
  if (!err) {
    console.log("listening to port 5500")
  }})



module.exports = app;
