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
let columnMap=new Map();

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

// class tableclass{
//     table = {};
//     constructor(){
//     this.table["top"]    = this.row();
//     this.table["center"] = this.row();
//     this.table["low"]    = this.row();
// ;}

// row(){
// let r = new Set();
// //r.size=0;
// let holes = new Set();
// //holes.size=0;

// while(r.size != 9){
// r.add(this.getRandom(1,100))
// }

// while(holes.size != 4){
//     holes.add(this.getRandom(1,9))
// }
// var rowlist = Array.from(r);
// var holeslist = Array.from(holes);
// var finalrow=[];
// while(holeslist.length){
// rowlist[holeslist.shift()]="@"
// }
// finalrow=rowlist;
// return finalrow;
// }

// getRandom(minimum,maximum){
//     let min=Math.floor(minimum);
//     let max=Math.ceil(maximum);
//     return Math.floor((Math.random()*(max-min))+min);
// }
// }
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
    while(size<=99){
        let num=getRandom(1,100)
        if(isSizeIncreased(num)){
            if(num){
                arr.push(num);
            }
            }
    }
    fillnumbers();
    //addTable();
    setTimeout(addTable,10);
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

function display(currentnum){
    let currentnum=arr.shift()
    
if(currentnum){
    newarr.push(currentnum)
    displaynumber.innerHTML="<p>"+currentnum+"</p>";
    readText(currentnum);
    document.getElementById(currentnum).style.backgroundColor = "green";
    document.getElementById(currentnum).parentElement.style.backgroundColor = "green"
    document.getElementById(currentnum).style.color = "white";
}else{
    if(newarr.length==99){
     clearInterval(timerstart);
     let thankyouele = document.createElement("div")
     thankyouele.innerText="game completed thankyou";
     document.body.appendChild(thankyouele)
    }
}
}
start();
var timerstart=setInterval(display,4000)
function stopInterval(){
    if(timerstart){
        timerstart = clearInterval(timerstart);
    }
}
function startInterval(){
    if(!timerstart){
        timerstart=setInterval(display,4000)
    }
    
}
function framer(){
    // mytable = iframe.children.filter(x=>x.tagname == "table")[0]
    mytable = iframe.contentDocument.getElementsByTagName("table")[0];
    


}
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
    function checkTable(table){
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
        
      
   
      
        if(currentRowgreencount>=5){
            // alert(currentName+" row completed")
            
            tabledata["is"+currentName+"completed"]=true;
            switch("is"+currentName+"completed"){
                case "istopcompleted":{
                    if(!istopcompletedDsiplayed){
                        stopInterval();
                        messagebox.innerText = "top line completed";
                        readText(messagebox.innerText);
                        istopcompletedDsiplayed =true;
                        overlay.style.display="visible";
                        messagebox.style.display="block";
                    }
                    
                    break;};
                case "iscentercompleted":{
                    if(!iscentercompletedDsiplayed){
                        stopInterval();
                        messagebox.innerText = "center line completed";
                        readText(messagebox.innerText);
                        iscentercompletedDsiplayed = true;
                        overlay.style.display="visible";
                        messagebox.style.display="block";
                    }
                    break;}
                case "islowcompleted":{
                    if(!islowcompletedDsiplayed){
                        stopInterval();
                        messagebox.innerText = "last line completed";
                        readText(messagebox.innerText);
                        islowcompletedDsiplayed = true;
                        overlay.style.display="visible";
                        messagebox.style.display="block";
                        
                    }
                    break;}
            }

        }
        rowgreencount += currentRowgreencount;
// alert(Array.from(row.children).filter(x=>{
//     if(x.classList.contains("green")){
//         return x;
//     }}).length)    
}
    if(rowgreencount>=5){

        if(!isJaldiFiveCompletedDisplayed){
            stopInterval();
        messagebox.innerText = "jaldi 5 completed !.......";
        readText(messagebox.innerText)
            isJaldiFiveCompletedDisplayed = true;
            overlay.style.display="visible";
            messagebox.style.display="block";
        }
        // alert("jaldi 5 for"+tabledata.id+"table");
    }
    if(rowgreencount == 15){
        // alert("housie completed");
        if(!isHousieCompleted){
            stopInterval();
            tabledata.isHousieCompleted = true;
            messagebox.innerText = "housee completed !.........";
            readText(messagebox.innerText);
            overlay.style.display="visible";
            messagebox.style.display="block";
        }
        
    }
    }
    // function createTable(){
    //     let name = "shankar" || window.prompt("hi your name place");
    // let tab  = new tableclass();
    // person = new user(name,tab)
    // }
    function addTable(){
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


