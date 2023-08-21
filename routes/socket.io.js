var users = new Map();
const housie = {
    jaldi5completed: null,
    toplinecompleted: null,
    middlelinecompleted: null,
    bottomlinecompleted: null,
    housiecompleted: null
}
let arr = [];
let interval = null;
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
function displayCurrentNumber(socket){
    let num = arr.shift();
    socket.emit('displaycurrentnumber', num);
}
function start() {
     interval = setInterval(displayCurrentNumber,3000)
}
function stop() {
    if (interval) {
        clearInterval(interval);
    }
}
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("user logged in");
        socket.on("join", (username) => {
            socket.join(username);
            users.set(socket.id, username);
            socket.emit("usersonline", users);
        });
        socket.on("privatemessage", ({ user, message }) => {
            io.to(user).emit({ sender: socket.id, message })
        });
        socket.on("start", start);
        socket.on('stop', stop);
        socket.on('resume', start);
       socket.on("disconnect", () => {
        users.delete(socket.id);
        socket.emit("usersonline", users);
       });
        
        //jaldi5completed
        function housieUpdater(achievementname,id, username) {
            let obj = {}
            obj.userid = id,
            obj.username = username
            housie[achievementname] = obj;
        }
        socket.on("jaldi5completed", username => {
            housieUpdater("jaldi5completed", socket.id, username);
            socket.emit("msgFromserver", "jaldi 5 completed by" + username);
            socket.emit("gamestatuschanged", housie);
});
        socket.on("toplinecompleted", username => {
            housieUpdater("toplinecompleted", socket.id, username);
            socket.emit("gamestatuschanged", housie);
            socket.emit("msgFromserver", "top line completed by" + username);
});
        socket.on("middlelinecompleted", username => {
            housieUpdater("middlelinecompleted", socket.id, username);
            socket.emit("msgFromserver", "middle line completed by" + username);
            socket.emit("gamestatuschanged", housie);
});
        socket.on("bottomlinecompleted", username => {
            housieUpdater("bottomlinecompleted", socket.id, username);
            socket.emit("msgFromserver", "bottom line completed by" + username);
            socket.emit("gamestatuschanged", housie);
});
        socket.on("housiecompleted", username => {
            housieUpdater("housiecompleted", socket.id, username);
            socket.emit("gamestatuschanged", housie);
            socket.emit("msgFromserver", "housie completed by" + username);
            socket.emit("endgame")
});
    });
}

