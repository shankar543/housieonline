const socket = io('http://localhost:5500');
let iframe = document.getElementsByTagName("iframe")[0];
let startButton = document.getElementsByClassName("startButton")[0];
let tablecontainer=document.getElementById("tablecontainer")
const displaynumber= document.getElementsByClassName("number")[0]
const disaplayAll = document.getElementsByClassName("displayAll")[0]
var overlay= document.getElementsByClassName("hover")[0];
var messagebox = document.getElementsByClassName("messagebox")[0];
let accordian = document.getElementsByClassName("accordian")[0];
let createButton   = document.getElementsByClassName("createButton")[0]
// let joinRoomButton = document.getElementsByClassName("joinRoomButton")[0]
let addTableButton = document.getElementsByClassName("addTableButton")[0]
let roomlist_elm = document.getElementsByClassName("roomlist")[0];
let roomnamejoined = document.getElementById('roomnamejoined');
var tabletab = document.getElementById("table")
// const socket = io();
let username = "";
let privateuser = ""
var usersonline = [];
let housie = {
    jaldi5completed: null,
    toplinecompleted: null,
    middlelinecompleted: null,
    bottomlinecompleted: null,
    housiecompleted: null
}
let roomname = null;

let table_cnt = 0;

let rooms = null;
let admin = "";
// isGameStarted
var isJaldiFiveCompletedDisplayed= false;
var istopcompletedDsiplayed      = false;
var iscentercompletedDsiplayed   = false;
var islowcompletedDsiplayed      = false;
var isHousieCompleted            = false;
var size=0;
var set = new Set();
var arr = [];
let newarr = [];
var tableId=0;

var _100rand_nums = new Set();
let termcnt = 0;
let table = {};
let columnnames = ["01s", "10s", "20s", "30s", "40s", "50s", "60s", "70s", "80s", "90s"];
let columnMap = new Map();
    var top = document.getElementById("top");
    var center = document.getElementById("center");
    var low = document.getElementById("low");
    var person={};
    class user{
        table=[];
        name;
        constructor(name,table){
            this.name=name;
            this.table=[];
            this.table.push(table)
            
        }
    }
let messagesFromServer = [];

socket.on('msgFromserver', ({ msg, eventname}) => {
    console.log("msg from server");
    displayMsgBox(msg);
    if (eventname && eventname == "admin_disconnected") {
        console.log(housie);
        roomname = "";
        resetValues();

    }
})
function getRandomInt(min, max) {
 return Math.floor(Math.random()*(max-min)+min);
}

overlay.addEventListener("click", function(eve){
    eve.target.classList.remove("hover")
});

function createColumnMap() {
    for(let column of columnnames){
        let colnum=parseInt(column.slice(0,2))
        columnMap.set(column,{"min":colnum,"max":colnum+9});
    }
}
createColumnMap();

function getRandom(minimum,maximum){
    let min=Math.floor(minimum);
    let max=Math.ceil(maximum);
    return Math.floor(Math.random()*max-min+min);
}

function isSizeIncreased(num){
    let updated=false
    updatedsetsize= set.add(num).size;
    if(size+1 === updatedsetsize){
        size = updatedsetsize
        updated=true;
    }
    return updated;
}
fillnumbers();
setTimeout(addTable, 10);
// alert("click add table to add 1 m ore table");
function start(){
    // startButton.style.disabled = true;
    // startButton.style.pointerEvents = "none";
    socket.emit('start',roomname);
}


function fillnumbers(){
    disaplayAll.innerHTML = "";
    for(let i=1;i<100;i++){
        let grid_item = document.createElement("div");
        grid_item.classList.add("grid-item")
        ele=document.createElement("span")
        ele.setAttribute("id",i)
        ele.innerText=i<10?"0"+i:i;
        linebreak = document.createElement("br");
        grid_item.appendChild(ele);
        disaplayAll.appendChild(grid_item);
        // if(i%10 ==0){disaplayAll.appendChild(linebreak)}
    }
}

socket.on("displaycurrentnumber", currentnum => {
    display(currentnum);
        startButton.style.disabled = false;
    startButton.style.pointerEvents = "auto";

})

function display(currentnum){
    if(currentnum){
    newarr.push(currentnum)
    displaynumber.innerHTML="<p>"+currentnum+"</p>";
    readText(currentnum);
    document.getElementById(currentnum).style.backgroundColor = "green";
    document.getElementById(currentnum).parentElement.style.backgroundColor = "green"
    document.getElementById(currentnum).style.color = "white";
}else{
    if(newarr.length==99){
        socket.emit('stop',roomname);
     let thankyouele = document.createElement("div")
     thankyouele.innerText="game completed thankyou";
     document.body.appendChild(thankyouele)
    }
}
}


function stopInterval() {
     if (!roomname) {
        roomname=roomnamejoined.innerText
    }
    if (username && roomname) {
        socket.emit('stop', roomname);
    }
}
function startInterval() {
    if (!roomname) {
        roomname=roomnamejoined.innerText
    }
    if (username && roomname) {
    socket.emit('start',roomname);
    }
}
function resumeInterval() {
     if (!roomname) {
        roomname=roomnamejoined.innerText
    }
    if (username && roomname) {
    socket.emit('resume',roomname)
    }
}
function resetValues() {
    console.log('reset button called');
   startButton.classList.add("display_none")   
    createButton.classList.add("display_none")
     if (!roomlist_elm) {
            roomlist_elm = document.getElementsByClassName("roomlist")[0];
            roomlist_elm?.classList?.add("display_none");
    }
    // joinRoomButton.classList.add("display_none")
addTableButton.classList.add("display_none")
}
socket.on("gamestarted", function () {
    // fillnumbers();
    // setTimeout(addTable, 10);
    resetValues();
})
function framer(){
mytable = iframe.contentDocument.getElementsByTagName("table")[0];
}

    

function createTable(){
    for(let column of columnnames ){
        let set =new Set();
        let min= columnMap.get(column).min;
        let max = columnMap.get(column).max;
        table[column]=[];
        while(set.size<3){
      set.add(getRandomInt(min,max));
    }
    table[column]=[...set].sort(function(a,b){return a-b});
    }
}

let displaytable={}
function createDisplayTable(){
displaytable.top=[]
displaytable.center=[]
displaytable.last=[]
for(let rowcount=0;rowcount<3;rowcount++){
for(let key in table){
switch(rowcount){
    case 0:{displaytable.top.push(table[key][rowcount]);
            break;};
    case 1:{displaytable.center.push(table[key][rowcount]);break;}
    case 2:{displaytable.last.push(table[key][rowcount]);break;} 
}
}
}
return displaytable;
}

function getHoles(tab){
    for(let column of Object.keys(tab) ){
        let holes = new Set();
        while(holes.size != 5){
          holes.add(this.getRandom(1,9))
         }
          //var rowlist = Array.from(column);
var holeslist = Array.from(holes);
while(holeslist.length){
    tab[column][holeslist.shift()]="@"
    }
    // finalrow=rowlist;
}
return tab;

}

    function fillTable(){
        createTable();
        let tab = createDisplayTable()//person.table[0] || new tableclass();
        var tabletop = document.createElement("tr");
        tabletop.setAttribute("name","top");
        var tablecenter = document.createElement("tr");
        tablecenter.setAttribute("name","center");
        var tablelow = document.createElement("tr");
        tablelow.setAttribute("name","low");
     tab = getHoles(tab)
        for(let x of tab.top){
            let td=document.createElement("td")
            td.innerText = x;
            if(x=="@"){
                td.classList.add("hole");
                td.innerText = "";
            }
            tabletop.appendChild(td)
            //JSON.parse(JSON.stringify(td))
        }
        for(let x of tab.center){
            let td=document.createElement("td")
            td.innerText = x;
            if(x=="@"){
                td.classList.add("hole");
                td.innerText = "";
            }
            tablecenter.appendChild(td)
        }
        for(let x of tab.last){
            let td=document.createElement("td")
            td.innerText = x;
            if(x=="@"){
                td.classList.add("hole");
                td.innerText = "";
            }
            tablelow.appendChild(td)
        }
        let mytable = document.createElement("table");
    mytable.appendChild(tabletop)
    mytable.appendChild(tablecenter)
    mytable.appendChild(tablelow);
    mytable.setAttribute("id",tableId++);
    mytable.addEventListener("click",function(e){
        if(e.target.innerText && newarr.indexOf(+e.target.innerText)!=-1){
            
            e.target.classList.add("green");
            if(e.target.parentElement.parentElement){
                checkTable(e.target.parentElement.parentElement);
            }
    
        }
    });
    tablecontainer.appendChild(mytable)
    }

function displayMsgBox(msg) {
                        messagebox.innerText = msg;
                        readText(messagebox.innerText);
                        overlay.style.display="visible";
    messagebox.style.display = "block";
    // setTimeout(removeitem, 2000);
}    

function checkTable(table) {
    let tabledata={}
    tabledata.istopcompleted = false;
    tabledata.iscentercompleted = false;
    tabledata.islowcompleted = false
    tabledata.isHousieCompleted = false;
    tabledata.isJaldiFiveCompleted = false;
    let rowgreencount=0;
    tabledata.id=table.getAttribute("id");    
    for(let row of table.children){
        let currentName = row.getAttribute("name");
    let currentRowgreencount =  Array.from(row.children).filter(x=>{
        if(x.classList.contains("green")){
            return x;
        }}).length;
        if (currentRowgreencount >= 5) {
            tabledata["is" + currentName + "completed"] = true;
            switch("is"+currentName+"completed"){
                case "istopcompleted":{
                    if(!housie.toplinecompleted){
                        stopInterval();
                         if (!roomname) {
        roomname=roomnamejoined.innerText
    }
                    socket.emit("toplinecompleted", { roomname , username });
                    }
                    break;};
                case "iscentercompleted":{
                    if (!housie.middlelinecompleted) {
                         if (!roomname) {
        roomname=roomnamejoined.innerText
    }
                        stopInterval();
                        socket.emit("middlelinecompleted", { roomname , username });
                    }
                    break;}
                case "islowcompleted":{
                    if (!housie.bottomlinecompleted) {
                         if (!roomname) {
        roomname=roomnamejoined.innerText
    }
                        stopInterval();
                      socket.emit("bottomlinecompleted", { roomname , username });
                    }
                    break;}
            }

        }
        rowgreencount += currentRowgreencount;

}
    if(rowgreencount>=5){

        if(!housie.jaldi5completed){
            stopInterval();
             if (!roomname) {
        roomname=roomnamejoined.innerText
    }
            if (username && roomname) {
                socket.emit("jaldi5completed", { roomname , username });
            }
        isJaldiFiveCompletedDisplayed = true;
        }
    }
    if(rowgreencount == 15){
        if (!housie.housiecompleted) {
             if (!roomname) {
        roomname=roomnamejoined.innerText
    }
            stopInterval();
            tabledata.isHousieCompleted = true;
            socket.emit("housiecompleted", { roomname , username });
        }
        
    }
    }

function addTable() {
    table_cnt++;
    if (table_cnt > 2) {
        alert('you cannot add more than 2 tables');
        return;
    }
    
    createTable()
    fillTable();
}

accordian.addEventListener("click", (e) => {
    if (document.querySelector(".closebtn").innerText == "close") {
        document.querySelector(".closebtn").innerText="open"
        disaplayAll.style.display="none";        
    } else {
        document.querySelector(".closebtn").innerText="close"
        disaplayAll.style.display="grid";
        disaplayAll.style.overflow="hidden";
    }

    })

function closeaccordian(event) {
    if(event.target.innerText=="close"){
        event.target.innerText="open"
        disaplayAll.style.display="none";
    }else{
        event.target.innerText="close"
        disaplayAll.style.display="grid";
        disaplayAll.style.overflow="hidden"
    }

}
function removeitem(){
    messagebox.style.display= "none";
}
function readText(txt){
    var speech = new SpeechSynthesisUtterance();
            speech.text=txt;
            speech.lang="en-US";
            speech.pitch=0;
            speech.volume = 1;
            speech.rate=1;
            speechSynthesis.speak(speech);
}
//==================socket code ===============
// get the io from the server code we get the link when we deploye it on heroku platform.
//emit user name on join to store user in users map
// on join update usres list in the room to the user
// private message to individual user 




function dropDownForUsers(data,listname) {
    let users = [];
    let person=""
    if (listname == "userslist") {
        data = JSON.parse(data);
    usersonline = data.usersonline;
        users = usersonline;
        person="user"
    }
    else {
        users = data;
        person = "roomate";
    }

    let usersDropdown = document.createElement("select")
    usersDropdown.setAttribute('id',listname)
    let messageUser = document.createElement("option");
    messageUser.value = undefined;
    messageUser.innerText = `select ${person} to send message`
    usersDropdown.prepend(messageUser);
      for (let user of users) {
        let option = document.createElement("option");
        option.innerText = user.username || user.id;
        option.value = user.id;
          usersDropdown.appendChild(option);
      }
    usersDropdown.addEventListener("change", (e) => {
        privateuser = e.target.value;
        openChatBox(privateuser,"Enter your message to send");
    })
    document.getElementById(listname)?.remove();
    document.body.appendChild(usersDropdown);
}
socket.on("usersonline", (data) => {
    dropDownForUsers(data, 'userslist');
});

function sendchat(chat,userid) {

        if (!privateuser || !userid) {
            console.log("please select private user");
        }
        if (!chat.value) {
            console.log("please enter some message to send");
        }
         socket.emit('privatemessage', { user: userid, message: chat.value });
            chat.parentElement.remove();
        
}

function openChatBox(userid,instruction) {
    let layer = document.createElement("div");
    layer.classList.add('absoluteChatBox');
    let intro = document.createElement('p');
    intro.innerText = instruction;
    layer.prepend(intro);
    let chat = document.createElement("input")
    layer.appendChild(chat);
    // chat.addEventListener("blur", function () { sendchat(chat, userid) });
    chat.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            sendchat(chat, userid);
        }
    })
    let sendbtn = document.createElement("button");
    sendbtn.innerText = "send";
    sendbtn.addEventListener("click", ()=>sendchat(chat,userid));
    layer.appendChild(sendbtn);
    document.body.appendChild(layer);
}
socket.on("gamestatuschanged", status => {
    housie = status;
});
socket.on("endgame", ({ rooms }) => {
    window.r
    tablecontainer.innerHTML = ""
    console.log(house)
    if (!housie.isHousieCompleted) {
        return;
    }
    displayMsgBox("hello"+username+" game is gompleted");
    console.log(housie);
    startButton.style.disabled = false;
    startButton.style.pointerEvents = "auto";
    roomname = null;
    roomnamejoined.innerText="no room joined"
    housie = {
    jaldi5completed: null,
    toplinecompleted: null,
    middlelinecompleted: null,
    bottomlinecompleted: null,
    housiecompleted: null
    }
   startButton.classList.remove("display_none")   
    createButton.classList.remove("display_none")
    roomsList.classList.remove("display_none");  
// joinRoomButton.classList.remove("display_none")
    addTableButton.classList.remove("display_none");
    updateRooms(rooms)

})
document.addEventListener('DOMContentLoaded',async function () {
     let userbanner = document.createElement('p');
            userbanner.classList.add('userbanner');
            document.body.append(userbanner);
            
    try {
        
        username = await promptDialogBox("give your gamer name");
        userbanner.innerText = username;
          document.getElementsByTagName('title')[0].innerText = username; 
        // if (usersonline?.length && usersonline?.indexOf(username) != -1) {
        //     username = await promptDialogBox(`${username} already existed please provied some other user name?`);
        // }

     } catch (err) {
        displayMsgBox(err);

    }
}) 
function promptDialogBox(prompt) {
    return new Promise((resolve, reject) => {
        overlay.style.display = "visible";
        let container=document.createElement('div');
        let promptelm = document.createElement("p");
        promptelm.innerText = prompt;
        container.prepend(promptelm);
        container.classList.add("promptcontainer");
        let promptValueelm = document.createElement("input");
        promptValueelm.setAttribute("placeholder", "reply here....");
        container.appendChild(promptValueelm);
        let enterbtn = document.createElement("button")
        container.appendChild(enterbtn);
        enterbtn.innerText = "Confirm";
        enterbtn.addEventListener("click", function (e) {
            if (!promptValueelm.value || promptValueelm?.value?.length < 2) {
                alert("please enter a valid user user name it should be atleast 3 letter")
            } else {
                resolve(promptValueelm.value);
                promptValueelm.parentElement.remove();
                
            }
        }) 
       
        document.body.append(container);
    })
}
async function createRoom() {
    try { 
        roomname = await promptDialogBox("enter a name for the room");
        roomnamejoined.innerText = roomname
    }
    catch (err) {
        console.log("erro in room creation");
    }
    console.log(roomname,usersonline)
    if (roomname && username) {
socket.emit("createroom",{roomname,username})
}
}
function joinRoom() {
    if (username && roomname) {
        console.log("koinromm request lled from joinroombutton")
        socket.emit("joinroom", { roomname, username });
 }   
}
socket.on("availableRooms", ({ rooms }) => {
    updateRooms(rooms);
})
function updateRooms(rooms) {
    let roomsList = document.createElement('ul');
    roomsList?.classList?.add('roomlist')
    for (let room of Object.keys(rooms)) {
        let roomname_elm = document.createElement('li');
        if (!rooms[room].isGameStarted) {
            roomname_elm.innerText = room;
            roomname_elm.setAttribute("value", room);
            roomsList.appendChild(roomname_elm);
        }
    }
    roomsList.addEventListener('click', (e) => {
        let roomtojoin = e.target.getAttribute("value");
        roomnamejoined.innerText = roomtojoin
        roomname = roomtojoin;
        if(roomname && username)
        socket.emit("joinroom", { roomname, username })
    });
document.body.append(roomsList);
}

socket.on("roomcreated", async ({ roomname, admin, rooms }) => {
    rooms = rooms;
    // joinRoomButton.classList.add("display_none");
    if (admin == username) {
        admin = username;
    createButton.classList.add("display_none");
    roomlist_elm?.classList?.add("display_none")
        return;
    } else {
        updateRooms(rooms);
    }
    try {
        let cofirmation = await confirmDialogueBox(`${admin} created a room </br> would you like to join the room?`)
        admin = admin;
        if (cofirmation && typeof cofirmation == 'boolean' && username && roomname) {
        socket.emit("joinroom", { roomname, username });
        roomname = roomname;
            roomnamejoined.innerText = roomname;
            startButton.classList.add("display_none");
    } else {
        if (!username) {
            alert('please enter user name')
        }
        cofirmation.remove();
    }
    } catch (err) {
        console.log(err);
}
});

socket.on('playerjoined', ({ msg, roomname, currentRoomPlayers ,username,rooms}) => {
  
    roomname = roomname;
    roomnamejoined.innerText = roomname;
    if (username == username) {
        createButton.classList.add("display_none");
        if (!roomlist_elm) {
            roomlist_elm = document.getElementsByClassName("roomlist")[0];
        }
        roomlist_elm?.classList?.add("display_none");
        if (admin && admin != username) {
            startButton?.classList?.add("display_none");
        }
    }
    updateRooms(rooms);
    displayMsgBox(msg);
dropDownForUsers(currentRoomPlayers, "roommates");
 });

function confirmDialogueBox(msg) {
         return new Promise((resolve, reject) => {
        overlay.style.display = "visible";
        let container=document.createElement('div');
        let promptelm = document.createElement("p");
        promptelm.innerText = msg;
        container.prepend(promptelm);
        container.classList.add("promptcontainer");
        let promptValueelm = document.createElement("button");
        let cancel = document.createElement("button");
        promptValueelm.innerText="JOIN";
             cancel.innerText = "cancel";
        container.appendChild(promptValueelm);
        container.appendChild(cancel);
        promptValueelm.addEventListener('click', async function () {
            resolve(true);
            promptValueelm.parentElement.remove();
        })
             cancel.addEventListener("click", async () => {
                 resolve(promptValueelm.parentElement);
             })
        
        overlay.append(container);
    })
    }