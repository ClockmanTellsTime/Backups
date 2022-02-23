/*TODO:
make a nicer reset and game 


features
Add prestige
add super upgrade
pretige give you x number of multiplier
pretige also give x gem mines
gems used for super upgrades


*/


/*FIXME: 

*/



class game {
    constructor() {
        this.spurts = {
            items: {
                money: 0,
                prestige: {
                    amount: 0,
                    cost: 10
                }
            },
            things: [],
            
        }
    }
}
class ore {
    constructor(name,value,time) {
        //cost is cost for automations
        //cost1 is starting cost for general
        
        this.name = name
        this.value = value
        this.cost = value * 100
        this.cost1 = value * 5
        this.time = time

        const n = this.name
        var e = this
        
        game_structure.spurts.things.push(n)
        game_structure.spurts.items[n] = {
            value: this.value,
            original_value: this.value,
            level: 1,
            cost: this.value * 5,
            original_price: this.value * 5,
            upgrade_multiplier: 1,
            unlocked: false,
            clicked: false,

            auto: false,
            _3X: false,
            //How much the bar is full
            progress: 0,
            //How much time has passed
            time: 0,
            //How much time it takes
            time_taken: this.time,
            //How much time it loses per upgrade    
            time_change: (this.time-10)/19,


        };

        this.click = function() {
            var n = this.name
            if (EA.spurts.items[n].clicked === false) {
                var time = EA.spurts.items[n].time
                var t = Math.floor(EA.spurts.items[n].time_taken)
                var update = 10

                EA.spurts.items[n].clicked = true
                var change = setInterval(function() {
                    t = Math.floor(EA.spurts.items[n].time_taken)
                    time += update
                    var frames = t/update
                    var increase = 100/frames
                    EA.spurts.items[n].progress += increase
                    document.getElementById(n+"_fill").style.width = EA.spurts.items[n].progress+"%"
                    if (time >= t) {
                        EA.spurts.items.money += (EA.spurts.items[n].value * (EA.spurts.items.prestige.amount + 1))
                        EA.spurts.items[n].clicked = false
                        setTimeout(function(){
                            EA.spurts.items[n].progress = 0
                            document.getElementById(n+"_fill").style.width = EA.spurts.items[n].progress+"%"
                        },50)
                        update_game()
                        clearInterval(change)
                    } 
                },update)   
                EA.spurts.items[n].time = 0;             
            }
        }
        
        this.give = function() {
            var n = this.name
            const {original_value} = EA.spurts.items[n]
            if (EA.spurts.items.money - (original_value * 100) >= 0 && document.getElementById(n+'_set').classList.contains("unlocked")) {
                EA.spurts.items[n].auto = true;
                EA.spurts.items.money -= original_value * 100;
                update_game()
            }
        }

        this.upgrade = function () {
            var amount = document.getElementById('upgrade_amount').value;
            var n = this.name
            var change = EA.spurts.items[n].time_change
            var count = 0;
            while (count < amount) {

                if (EA.spurts.items.money >= EA.spurts.items[n].cost) {
                    let {cost} = EA.spurts.items[n]

                    EA.spurts.items[n].level += 1
                    EA.spurts.items.money -= cost

                    update_game()


                    if (n != EA.spurts.things[EA.spurts.things.length]) {
                        const change = EA.spurts.items[n].time_change
                        if (EA.spurts.items[n].time_taken - change > 0) {
                            EA.spurts.items[n].time_taken -= change
                        }
                    }

                }
                else {
                    break
                }
                count ++;
            }
            
        }

        this._3X = function() {
            if ((EA.spurts.items.money - game_structure.spurts.items[n].original_price*20) >= 0 && document.getElementById(n+'_set').classList.contains("unlocked")) {
                EA.spurts.items.money -= game_structure.spurts.items[n].original_price*20
                EA.spurts.items[n].upgrade_multiplier *= 3

                EA.spurts.items[n]._3X = true;
                update_game()
            }
        }

        /* Auto click */ setInterval(function() {
            if (EA.spurts.items[e.name].auto === true && document.getElementById(n+'_set').classList.contains("unlocked")) {
                e.click()
            }
        },0)

        /*add UI */{
            var set = document.createElement("div")
            set.id = n + "_set"
            set.className = "set"
            set.innerHTML = `
            <button class="give_money" id="${n}_give">${n}</button>
            <div class="progress" id="${n}_progress">
                <div class="progress_fill" id="${n}_fill"></div>
                <label class="click_display" id="${n}_click"></label>
            </div>
            <button class="upgrade_button" id="${n}_upgrade">&uarr;</button>
            <div id="${n}_bg" class="upgrade_cost_background"></div>
            `


            var btn = document.createElement("button")
            btn.className = "give_manager"
            btn.id = n + "_give_manager"
            btn.innerHTML = `${n} mine<sup>$${tidy(this.cost)}</sup>` 
            btn.onclick = function() {e.give()}
            
            var btn1 = document.createElement("button")
            btn1.innerHTML = `${n} - 3X profits<sup>$${tidy(this.cost)}</sup>` 
            btn1.className = "_3X_upgrade"
            btn1.id = n + "_3X_upgrade"
            btn1.onclick = function() {e._3X()}

            var label = document.createElement("label")
            label.className = "upgrade_cost_display"
            label.id = n + "_cost"



            var br = document.createElement("br")

            document.getElementById("sets").appendChild(set) 
            document.getElementById("sets").appendChild(br) 
            document.getElementById("managers").appendChild(btn)
            document.getElementById("upgrades").appendChild(btn1)
        
            document.getElementById(n+"_bg").appendChild(label)
            
            if (n != EA.spurts.things[0]) {
                document.getElementById(n+"_set").classList.add("locked")
            }
            else {
                document.getElementById(n+"_set").classList.add("unlocked")
            }


            if (n.length > 6) {
                document.getElementById(n+"_give").style.fontSize = "10px"
            }

            var btn = document.getElementById(n+"_give")
            btn.onclick = function() {e.click()}

            var btn = document.getElementById(n+"_upgrade")
            btn.onclick = function() {e.upgrade()}
            btn.onmouseenter = function() {
                document.getElementById(n+"_bg").style.visibility = "visible"
            }
            btn.onmouseleave = function() {
                document.getElementById(n+"_bg").style.visibility = "hidden"
            }

            var label = document.getElementById(n+"_click")
            label.innerHTML = "$"+tidy(EA.spurts.items[n].value)

        }

    }
}
function update_game() {
    for (var i in EA.spurts.things) {
        const n = EA.spurts.things[i]
        let {level,original_value,upgrade_multiplier} = EA.spurts.items[n]

        EA.spurts.items[n].value = level * original_value * upgrade_multiplier
        EA.spurts.items[n].cost = Math.floor(EA.spurts.items[n].original_price * (1.2**(EA.spurts.items[n].level-1)))

        document.getElementById(n+'_click').innerHTML = "$" + tidy(EA.spurts.items[n].value)
        document.getElementById(n+'_cost').innerHTML = "$" + tidy(EA.spurts.items[n].cost)

        if (EA.spurts.items[n].unlocked) {
            document.getElementById(n+'_set').classList.replace("locked","unlocked")
        }

        var x = n
        //unlock next set
        if (n !== EA.spurts.things[EA.spurts.things.length-1]) {
            var y = EA.spurts.things[EA.spurts.things.indexOf(x)+1]
            if (EA.spurts.items[x].level >= 20) {
                EA.spurts.items[y].unlocked = true                    
            }
        }

        if (EA.spurts.items[n].auto) {
            document.getElementById(n + "_give_manager").classList.add("locked")
        }
        if (EA.spurts.items[n]._3X) {
            document.getElementById(n + "_3X_upgrade").classList.add("locked")
        }

        if (EA.spurts.items.money < EA.spurts.items[n].cost) {
            document.getElementById(n+'_upgrade').style.backgroundColor = "red"
        }
        else  {
            document.getElementById(n+'_upgrade').style.backgroundColor = "#FCFCFC"
        }

        const change = EA.spurts.items[n].time_change
        if (EA.spurts.items[n].time_taken - change > 0) {}
        else {
            if (EA.spurts.items[n].auto) {
                document.getElementById(n+"_progress").style.backgroundColor = "gray"
            }
        }

    }


    document.getElementById('moneyDisplay').innerHTML = "Money: $" + tidy(EA.spurts.items.money)
}

function prestige() {
    if (EA.spurts.items.money >= EA.spurts.items.prestige.cost) {
        EA.spurts.items.money = 0;
        EA.spurts.items.prestige.amount += 1
        document.getElementById('sets').innerHTML = ""

    }
}

function tidy(char) {
    try {
        if (typeof(char) == "number") {
        const formatter = new Intl.NumberFormat('en', {
            notation: 'compact'
        })
            char = String(formatter.format(char));
            return char
        }
        
        else {
            if (char.includes("_")) {
                var x = char.replace("_"," ")
            }
            else {
                var x = char;
            }
            return x
        }
    }
    catch(err) {
        reset();
    }
}

function save() {
    localStorage.clear()
    localStorage.setItem("gameData",JSON.stringify(EA.spurts.items))
}

function load() {

    var data = JSON.parse(localStorage.getItem("gameData"))
    if (typeof(data) != "undefined") {
        EA.spurts.items = data;
        update_game()

        for (var i in EA.spurts.things) {
            EA.spurts.items[EA.spurts.things[i]].clicked = false
        }
    }

}

function reset() {
    document.getElementById("sets").innerHTML = ""
    game_structure = new game()
    EA  = game_structure
    dirt = new ore("dirt",1,second)
    stone = new ore("stone",10,second * 2)
    copper = new ore("copper",100,second * 5)
    iron = new ore("iron",1000,second * 10)
    steel = new ore("steel",10000,second * 30)
    bronze = new ore("bronze",100000,minute)
    gold = new ore("gold",1000000,minute*2.5)
    topaz = new ore("topaz",10000000,minute*5)
    amathyst = new ore("amathyst",100000000,minute*15)

}


const second = 1000
const minute = 60000
const hour = minute * 60
const day = hour * 24
const week = day * 7
const month = day * 30
const year = month * 12
const decade = year * 10
const centery = decade * 10

let game_structure = new game()
var EA  = game_structure

function main() {
    dirt = new ore("dirt",1,second)
    stone = new ore("stone",10,second * 2)
    copper = new ore("copper",100,second * 5)
    iron = new ore("iron",1000,second * 10)
    steel = new ore("steel",10000,second * 30)
    bronze = new ore("bronze",100000,minute)
    gold = new ore("gold",1000000,minute*2.5)
    topaz = new ore("topaz",10000000,minute*5)
    amathyst = new ore("amathyst",100000000,minute*15)
    //EA.spurts.items.money = 10000
    load()
}


var update = setInterval(function() {update_game()},10)
var saveGame = setInterval(function() {save()},10)


document.addEventListener('keydown',e => {
    if (e.key.toLowerCase() == "s" && e.ctrlKey) {
        e.preventDefault()
    }

    if (e.key.toLowerCase() == "q" && e.ctrlKey) {
        alert("lolo get rekt","progress reseted")
        reset()
    }
})












var x = 0
var visibility = ["0px","-25%"]
function toggle() {
    var btn = document.getElementById("toggle")
    document.getElementById("menu").style.right = visibility[x]
    document.getElementById("managers").style.display = "none"
    document.getElementById("upgrades").style.display = "none"
    x2 = 0;
    x1 = 0
    
    if (x == 0) {x = 1}
    else if (x == 1) {x = 0}
}

var x1 = 0
var visibility1 = ["block","none"]
function toggle_manager() {
    document.getElementById("managers").style.display = visibility1[x1]
    document.getElementById("upgrades").style.display = "none"
    x2 = 0;
    if (x1 == 0) {x1 = 1}
    else if (x1 == 1) {x1 = 0}
}

var x2 = 0
var visibility2 = ["block","none"]
function toggle_upgrades() {
    document.getElementById("upgrades").style.display = visibility2[x2]
    document.getElementById("managers").style.display = "none"
    x1 = 0
    if (x2 == 0) {x2 = 1}
    else if (x2 == 1) {x2 = 0}
}


function alert(title,content) {
    document.getElementById("alert").style.display = "block"
    document.getElementById("alert_title").innerHTML = title
    document.getElementById('words').innerHTML = content
}

function hide_alert() {
    document.getElementById("alert").style.display = "none"
}