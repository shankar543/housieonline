let displaynum= document.getElementsByClassName("number")[0]
const disaplayAllNumbers = document.getElementsByClassName("displayAll")[0]



var size=0;
var set = new Set();
var arr=[]
let newarray=[]

function getRandom(minimum,maximum){
    let min=Math.floor(minimum);
    let max=Math.ceil(maximum);
    return Math.floor((Math.random()*max-min)+min);
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
        disaplayAllNumbers.appendChild(grid_item);
        if(i%10 ==0){disaplayAllNumbers.appendChild(linebreak)}
    }
}

function display(){
    let currentnum = arr.shift();
    if(currentnum){
    newarray.push(currentnum)
    displaynum.innerHTML="<h1>"+currentnum+"</h1>";
    document.getElementById(currentnum).style.backgroundColor = "green";
}else{
    if(newarray.length==99){
     clearInterval(timerstart);
     let thankyouele = document.createElement("div")
     thankyouele.innerText="game completed thankyou";
     document.body.appendChild(thankyouele)
    }
}
}
start();
var timerstart=setInterval(display,400)