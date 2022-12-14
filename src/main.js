const cookieImg = document.querySelector("img.cookie");
const upgradeContainer = document.querySelector("tbody.upgradeContainer");
const cookiePerSecDiv = document.querySelector("div.cookiePerSec");
const cookiePerClickDiv = document.querySelector("div.cookiePerClick");
const cookieCounter  = document.querySelector("div.cookieCounter");


let cookieBank = 0;
let cookiePerSec = 0; 
let cookiePerClick = 1;


let upgradeList = [];

function updateCookies(){
    cookieCounter.innerHTML = Math.floor(cookieBank);
    checkAvailableUpgrades();
}


cookieImg.addEventListener("click", () =>{
    cookieBank = Number(cookieCounter.textContent);
    cookieBank +=cookiePerClick;
    updateCookies();
});

class Upgrade{
    //jsondata for creating UPDATE, container for adding to html
    constructor(jsondata, container){
        this.id = jsondata.id;
        this.name = jsondata.name;
        this.cost = jsondata.cost;
        this.incClickPerSec = jsondata.incClickPerSec;
        this.incClickValue = jsondata.incClickValue;
        this.levelUpIncrease = jsondata.levelUpIncrease;
        this.level = 0;

        // checking for Click Per Sec or Click value Increment (or both) in display
        let str = `<tr><td class="level${this.id}">${this.level}</td><td><button value="${this.id}" onclick="upgrade(this.value)" class="upgradeButton${this.id}">${this.name}</button></td><td class="cost${this.id}">${this.cost}</td>`;
        if(this.incClickValue>0 && this.incClickPerSec>0)
        str +=`<td>+${this.incClickPerSec}PS +${this.incClickValue}CV</td></tr>`;
        else if(this.incClickValue>0) str+=`<td>+${this.incClickValue}CV</td></tr>`;
        else str+=`<td>+${this.incClickPerSec}PS</td></tr>`;
        container.innerHTML += str;
    };
    
}

const upgrade = (value) => {
    let cost = upgradeContainer.querySelector(`.cost${value}`);
    let level = upgradeContainer.querySelector(`.level${value}`);
    if(cookieBank>=upgradeList[value].cost){
        //cost update
        cookieBank-=upgradeList[value].cost;
        upgradeList[value].cost = Math.floor(upgradeList[value].cost*130)/100;
        cost.innerHTML = upgradeList[value].cost;
        //level update
        upgradeList[value].level++;
        level.innerHTML= upgradeList[value].level;
        // boost update 
        cookiePerClick +=upgradeList[value].incClickValue;
        cookiePerClickDiv.innerHTML = cookiePerClick;
        cookiePerSec += upgradeList[value].incClickPerSec;
        cookiePerSecDiv.innerHTML = cookiePerSec;
        updateCookies();
    }else{
        console.log("You need more cookies!");
    }
}  
function checkAvailableUpgrades(){
    let button;
    for(let i = 0; i<upgradeList.length;i++){
        button = upgradeContainer.querySelector(`.upgradeButton${i}`);
        if(cookieBank>=upgradeList[i].cost) 
            button.classList.add("active");
        else 
        button.classList.remove("active");
    }
}


function main(){
    // READING FROM data.json
    fetch("./data.json")
    .then(response => {
       return response.json();
    })
    .then(jsondata => {
        //  CREATE AND SAVE UPGRADES IN upgradeList
        for(let i = 0; i<jsondata.upgrades.length;i++){
            upgradeList.push(new Upgrade(jsondata.upgrades[i],upgradeContainer));
        }

    });
    // TIMER FOR UPDATE COOKIES PER SECOND
    function startTimer() {
        timer = setInterval(function() {
            cookieBank += cookiePerSec;
            console.log(cookiePerSec);
            updateCookies();
        }, 1000);
    }
    startTimer();
}
main();
 