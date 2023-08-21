const socket = io('htttps://geroku.com/shankar543/housie.com');
const username = "vijaya";
let privateuser = ""
var usersonline = [];
let housie = {
    jaldi5completed: null,
    toplinecompleted: null,
    middlelinecompleted: null,
    bottomlinecompleted: null,
    housiecompleted: null
}
let table_cnt = 0;
let iframe = document.getElementsByTagName("iframe")[0];
let tablecontainer=document.getElementById("tablecontainer")
const displaynumber= document.getElementsByClassName("number")[0]
const disaplayAll = document.getElementsByClassName("displayAll")[0]
var overlay= document.getElementsByClassName("hover")[0];
var messagebox = document.getElementsByClassName("messagebox")[0];
let accordian = document.getElementsByClassName("accordian")[0];
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
var tabletab = document.getElementById("table")
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

socket.on('msgFromserver', msg => {
    displayMsgBox(msg);
    setTimeout(removeitem, 4000);
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

function start(){
    socket.emit('start');
    fillnumbers();
    setTimeout(addTable, 10);
}


function fillnumbers(){
    
    for(let i=1;i<100;i++){
        let grid_item = document.createElement("div");
        grid_item.classList.add("grid-item")
        ele=document.createElement("span")
        ele.setAttribute("id",i)
        ele.innerText=i;
        linebreak = document.createElement("br");
        grid_item.appendChild(ele);
        disaplayAll.appendChild(grid_item);
        // if(i%10 ==0){disaplayAll.appendChild(linebreak)}
    }
}

socket.on("displaycurrentnumber", currentnum => {
    display(currentnum);
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
        socket.emit('stop');
     let thankyouele = document.createElement("div")
     thankyouele.innerText="game completed thankyou";
     document.body.appendChild(thankyouele)
    }
}
}


function stopInterval(){
    socket.emit('stop');
}
function startInterval() {
    socket.emit('start');
}
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
                        messagebox.style.display="block";
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
                    socket.emit("toplinecompleted", username);
                    }
                    break;};
                case "iscentercompleted":{
                    if(!housie.middlelinecompleted){
                        stopInterval();
                        socket.emit("middlelinecompleted", username);
                    }
                    break;}
                case "islowcompleted":{
                    if(!housie.bottomlinecompleted){
                        stopInterval();
                      socket.emit("bottomlinecompleted", username);
                    }
                    break;}
            }

        }
        rowgreencount += currentRowgreencount;

}
    if(rowgreencount>=5){

        if(!housie.jaldi5completed){
            stopInterval();
            socket.emit("jaldi5completed", username);
        isJaldiFiveCompletedDisplayed = true;
        }
    }
    if(rowgreencount == 15){
        if(!housie.housiecompleted){
            stopInterval();
            tabledata.isHousieCompleted = true;
            socket.emit("housiecompleted", username);
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
function closeaccordian(event){
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




socket.emit('join', username);
socket.on("usersonline", users => {
    usersonline = users;
    let usersDropdown = document.createElement("select")
    let messageUser = document.createElement("option");
    messageUser.value = undefined;
    messageUser.innerText = "select user to send message"
    usersDropdown.prepend(messageUser);
    for (let user of user) {
        let option = document.createElement("option");
        option.innerText = user;
        option.value = user;
        usersDropdown.appendChild(option);
    }
    usersDropdown.addEventListener("change", (e) => {
        privateuser = e.target.value;
        openChatBox();
    })
});
function sendchat(chat) {

        if (!privateuser) {
            alert("please select private user");
        }
        if (!chat.value) {
            alert("please enter some message to send");
        }
        if (confirm(`send messag to ${privateuser}`)) {
            socket.emit('privatemessage', { user: privateuser, message: chat.value });
            chat.parentElement.remove();
        }
        
}

function openChatBox() {
    let layer = document.createElement("div");
    layer.classList.add('absolute');
    let chat = document.createElement("input")
    chat.addEventListener("blur",sendchat(chat));
    layer.appendChild(chat);
    let sendbtn = document.createElement("buttion");
    sendbtn.innerText = "send";
    sendbtn.addEventListener("click", sendChat(chat));
    layer.appendChild(sendbtn);
    document.body.appendChild(layer);
}
socket.on("gamestatuschanged", status => {
    housie = status;
});
socket.on("endgame", () => {
    displayMsgBox("game completed thankyou for playing");
})