/*
WROGOWIE:
1 - SLIME

ITEMY:
1 - MIKSTURA ŻYCIA
2 - HEŁM
3 - PIERŚCIEŃ
*/

// First load
let character = document.querySelector(".character");
let map = document.querySelector(".map0");
let styleEq = document.querySelector(".eq").classList
let styleInv = document.querySelector(".inv").classList
let styleWalka = document.querySelector(".walka").classList
let stylePowiadomienie = document.querySelector(".powiadomienie").classList
let styleDmg = document.querySelector(".dmg").classList

let eq = 0
let hp = 50
let xp = 0
let maxHp = 100
let maxXp = 100
let exp = 100
let idMapy = 0

let inv = 0
let mozna = 1
let schowaj = null
let schowajEq = null
let schowajInv = null
let zalozony = null
let moznachodzic = 1
let trzymam = false
let idSlotu = null

let slotHelm = null
let slotKolczyki = null
let slotBron = null
let slotZbroja = null
let slotPierscionek = null
let slotSpodnie = null
let slotButy = null

let x = 128;
let y = 128;
let held_directions = []; 
let speed = 1; 
let level = 1
let obrazenia = 50

let walcze = 0
let wskaznik = document.querySelector(".wskaznik")
let odbiaj = null
let hpEnemy = 100
let bije = 0 

let leftLimit = 0;
let rightLimit = 16*28;
let topLimit = -8
let bottomLimit = 16*17

let wrogId = null
let pokonani = []
let wrogowie = []


// Spawn enemies
document.querySelectorAll(".wrog").forEach((x)=>{
   wrogowie.push(Number((x.classList[1].slice(-1, x.classList[1].length))))
})

// Equipment preparation
document.querySelectorAll(".slot").forEach((slot)=>{
   id = slot.getAttribute("idSlotu")
   if (id==15) {
      slotHelm = slot
   }
   if (id==16) {
      slotKolczyki = slot
   }
   if (id==17) {
      slotBron = slot
   }
   if (id==18) {
      slotZbroja = slot
   }
   if (id==19) {
      slotPierscionek = slot
   }
   if (id==20) {
      slotSpodnie = slot
   }
   if (id==21) {
      slotButy = slot
   }
})

//GAMELOOP
const placeCharacter = () => {
   let pixelSize = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
   );
   
   const held_direction = held_directions[0];
   if (held_direction && moznachodzic==1) {
      if (held_direction === "right") {x += speed;}
      if (held_direction === "left") {x -= speed;}
      if (held_direction === "down") {y += speed;}
      if (held_direction === "up") {y -= speed;}
      character.setAttribute("facing", held_direction);
   }
   character.setAttribute("walking", held_direction && moznachodzic==1 ? "true" : "false");


   if (x < leftLimit) { x = leftLimit; }
   if (x > rightLimit) { x = rightLimit; }
   if (y < topLimit) { y = topLimit; }
   if (y > bottomLimit) { y = bottomLimit; }


   // COLLISIONS, ENEMIES, ENTERNACES (x1, y1, x2, y2)

   if (idMapy==0) {
      sciana(1,1,8,6)
      sciana(7.5,1,8.75,5)
      sciana(8.75,1,11.25,6)
      sciana(20,1,22,3)
      sciana(13,4,16,5.5)
      sciana(11,5,12,6)
      sciana(10.5,9.5,13.5,11.5)
      sciana(12.5,11.5,15,12.5)
      sciana(15,9.5,16,11.5)
      sciana(13.5,8.5,15,9.5)
      sciana(5,10,8,11)
      sciana(5,11,7,11.5)
      sciana(1,10,3,12.5)
      sciana(3,11,4,12.5)
      sciana(4,13,6,14)
      sciana(2,16,4,18)
      sciana(10.5,15.5,11,17)
      sciana(13.5,15,16,17)
      sciana(19,8,21,9.5)
      sciana(21.5,5,24,7)
      sciana(23,8,26,9.25)
      sciana(26.5,9,27.5,10)
      sciana(27,5,29,6)
      sciana(10,18,12,19)
      sciana(16,18,18,19)
      sciana(19.5,14,21,19)
      sciana(12,13.25,14,14.25)
      sciana(20.75,13,22,14)
      sciana(21.75,12,30,13)
   
      wrog(4,9,5,10,1)
      wrog(14,6,15,7,2)
      wrog(11,12,12,13,3)
   
      przejscie(8,5,11.25,5.5,1)
   }
   if (idMapy==1) {
      sciana(0,3,2.25,4)
      sciana(0,4,1.25,5)
      sciana(4.25,4.25,10,10)
      sciana(0,6.5,1.5,8)
      sciana(2,7,2.5,9)
      sciana(3.25,7,4.25,9)
   
      przejscie(2.5,7.5,3.25,9,0)
   }

   document.querySelector(".x").innerHTML = "x = "+String(Math.round(x/16)+1)
   document.querySelector(".y").innerHTML = "y = "+String(Math.round((y-8)/16)+2)
   
   let camera_left = pixelSize * 66;
   let camera_top = pixelSize * 42;
   
   map.style.transform = `translate3d( ${-x*pixelSize+camera_left}px, ${-y*pixelSize+camera_top}px, 0 )`;
   character.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;

   if (hp>0 && hp!==maxHp) {
      document.querySelector(".zycie2").style.width = hp/maxHp*100 + "%"
   }
   else if (hp==maxHp) {
      document.querySelector(".zycie2").style.width = "100%"
   }
   else {
      umarles()
   }

   if (xp>=maxXp) {
      xp -= maxXp
      level += 1
      animacjaLevel()
      updateStaty()
      update()
   }
}


// BEGIN GAMELOOP 
setInterval(() => {
   placeCharacter();
}, 11)


// MOVEMENT KEYS

const keys = {
   38: "up",
   87: "up",
   37: "left",
   65: "left",
   39: "right",
   68: "right",
   40: "down",
   83: "down",
}

document.addEventListener("keydown", (e) => {
   let dir = keys[e.which];   // NOT WALKING
   if (held_directions.indexOf(dir) === -1) {
      held_directions.unshift(dir)
   }
   if (e.key == "e") {        // INVENTORY
      if (eq == 0 && inv == 0 && mozna==1) {
         eq = 1
         moznachodzic = 0
         document.querySelector(".eq").style.visibility = "visible"
         styleEq.remove("hidden")
         styleEq.add("visible")
         clearTimeout(schowajEq)
         mozna = 0
      }
      else if (eq == 1) { 
         eq = 0
         moznachodzic = 1
         styleEq.remove("visible")
         styleEq.add("hidden")
         schowajEq = setTimeout(()=>{
            document.querySelector(".eq").style.visibility = "hidden"
            mozna = 1
         },250)
      }
   }
   if (e.key == " ") { // ATTACK
      hit()
   }
   if (e.key == "r") {     // EQUIPMENT
      if (eq==0 && inv==0 && mozna == 1) {
         moznachodzic = 0
         inv=1
         document.querySelector(".inv").style.visibility = "visible"
         styleInv.remove("hidden")
         styleInv.add("visible")
         clearTimeout(schowajInv)
         mozna = 0
      }
      else if (inv == 1) {
         moznachodzic = 1
         inv = 0
         styleInv.remove("visible")
         styleInv.add("hidden")
         schowajInv = setTimeout(()=>{
            document.querySelector(".inv").style.visibility = "hidden"
            mozna = 1
         },250)
      }
   }
})

// WALKING
document.addEventListener("keyup", (e) => {
   let dir = keys[e.which];
   let index = held_directions.indexOf(dir);
   if (index > -1) {
      held_directions.splice(index, 1)
   }
});

// ITEM 
function itemy() {
   document.querySelectorAll(".item").forEach((item)=>{
      item.addEventListener("mousedown", ()=>{
         if (item.getAttribute("zalozony")==null || item.getAttribute("zalozony")==0) {
            document.querySelectorAll(".slot").forEach((slot)=>{
               if (slot.getAttribute("over")==1) {
                  idSlotu = slot.getAttribute("idSlotu")
               }
               if (slot.getAttribute("zalozony")==1) {
                  zalozony = 1
               }
               else {
                  zalozony = 0
               }
            })
            item.setAttribute("hold", "1")
            trzymam = item.getAttribute("item")
         }
      })
   })
}
itemy()

// ITEM DROPPED TO ANOTHER SLOT
function noHold() {
   document.querySelectorAll(".slot").forEach((slot)=>{
      if (slot.getAttribute("over")==1 && trzymam>0 && slot.innerHTML<=0){
         slot.innerHTML="<div item="+String(trzymam)+" class='pixel-art item item"+String(trzymam)+"' listener='0' pixel-art' zalozony="+String(zalozony)+"></div>"
         document.querySelectorAll(".slot").forEach((slot)=>{
            if (slot.getAttribute("idSlotu")==idSlotu) {
               slot.innerHTML = null
            }
         })
         update()
      }
   })
   trzymam = 0
}

document.addEventListener("mouseup", noHold)

document.querySelectorAll(".slot").forEach((slot)=>{
   slot.addEventListener("mouseenter", ()=> {
      slot.setAttribute("over","1")
   })
   slot.addEventListener("mouseleave", ()=> {
      slot.setAttribute("over","0")
   })
})

// ITEM DESCRIPTIONS

function opisy() {
   document.querySelectorAll(".item").forEach((item)=>{
      item.addEventListener("mouseenter", ()=> {
         document.querySelector(".opis"+String(item.getAttribute("item"))).style.visibility = "visible"
      })
      item.addEventListener("mouseleave", ()=> {
         document.querySelector(".opis"+String(item.getAttribute("item"))).style.visibility = "hidden"
      })
   })
}
opisy()

// ITEMS EFFECTS

function funkcjeItemow() {
   document.querySelectorAll(".item").forEach((item)=>{
      let id = item.getAttribute("item")              // ITEM ID
      let zalozony = item.getAttribute("zalozony")    // IS IT EQUIPPED?
      let listener = item.getAttribute("listener")    // DOES IT HAVE A LISTENER

      if (id==1 && listener == 0) {
         item.setAttribute("listener", 1)
         item.addEventListener("dblclick", ()=> {
            if (hp<maxHp) {
               hp += 20
               if (hp>maxHp) {
                  hp = maxHp
               }
               item.parentElement.innerHTML = ""
               document.querySelector(".opis1").style.visibility = "hidden"
               update()
            }
         })
      }

      if (id==2 && listener == 0 && zalozony==0) {
         item.setAttribute("listener", 1)
         item.addEventListener("dblclick", ()=> {
            if (slotHelm.innerHTML == "") {
               item.parentElement.innerHTML = ""
               document.querySelector(".opis2").style.visibility = "hidden"
               slotHelm.innerHTML = "<div item='2' zalozony='1' listener='0' class='item item2 pixel-art'></div>"
               maxHp += 75
               update()
            }
         })
      }

      if (id==2 && listener == 0 && zalozony==1 ) {
         item.setAttribute("listener", 1)
         item.addEventListener("dblclick", ()=> {
            let zdjeto = 0
            document.querySelectorAll(".slotItem").forEach((slot)=>{
               if (zdjeto==0 && slot.innerHTML == "") {
                  document.querySelector(".opis2").style.visibility = "hidden"
                  slot.innerHTML= "<div item='2' zalozony='0' listener='0' class='item item2 pixel-art'></div>"
                  slotHelm.innerHTML = ""
                  maxHp -= 75
                  if (hp>maxHp) {
                     hp = maxHp
                  }
                  update()
                  zdjeto=1
               }
            })
         })
      }

      if (id==3 && listener == 0 && zalozony==0) {
         item.setAttribute("listener", 1)
         item.addEventListener("dblclick", ()=> {
            if (slotPierscionek.innerHTML == "") {
               item.parentElement.innerHTML = ""
               document.querySelector(".opis3").style.visibility = "hidden"
               slotPierscionek.innerHTML = "<div item='3' zalozony='1' listener='0' class='item item3 pixel-art'></div>"
               obrazenia += 20
               update()
            }
         })
      }

      if (id==3 && listener == 0 && zalozony==1 ) {
         item.setAttribute("listener", 1)
         item.addEventListener("dblclick", ()=> {
            let zdjeto = 0
            document.querySelectorAll(".slotItem").forEach((slot)=>{
               if (zdjeto==0 && slot.innerHTML == "") {
                  document.querySelector(".opis3").style.visibility = "hidden"
                  slot.innerHTML= "<div item='3' zalozony='0' listener='0' class='item item3 pixel-art'></div>"
                  slotPierscionek.innerHTML = ""
                  update()
                  zdjeto=1
               }
            })
         })
      }
   })
}
funkcjeItemow()

// UPDATE HEALTH BARS ETC.

function updateZdrowie() {
   if (hp==maxHp) {
      document.querySelector(".hpPasek").style.width = "100%"
   }
   else if (hp<=0) {
      document.querySelector(".hpPasek").style.width = "0%"
   }
   else {
      document.querySelector(".hpPasek").style.width = String((hp/maxHp)*100)+"%"
   }
   document.querySelector(".hpInfo").innerHTML = "HP: " + String(hp)+"/"+String(maxHp)
}

function updateXp() {
   document.querySelector(".xpPasek").style.width = String(xp)+"%"
   document.querySelector(".xpInfo").innerHTML = "XP: " + String(xp)+"/"+String(maxXp)
}


// UPDATE EVERYTHING

function update() {
   updateZdrowie()
   funkcjeItemow()
   opisy()
   itemy()
   updateXp()
   updateLevel()
}

function updateLevel() {
   document.querySelector(".level").innerHTML = "Level "+level
}

// BATTLE

function walka() {
   walcze = 1
   styleWalka.remove("hidden")
   styleWalka.add("visible")
   document.querySelector(".walka").style.visibility = "visible"
   let lewo = 0
   let prawo = 0
   odbijaj = setInterval(()=>{
      if (lewo < 98 && prawo==0) {
         lewo += 0.5
         wskaznik.style.left = lewo + "%"
      }
      if (lewo==98) {
         prawo=1
      }
      if (lewo > 0 && prawo==1) {
         lewo -= 0.5
         wskaznik.style.left = lewo + "%"
      }
      if (lewo==0) {
         prawo=0
      }
   },1.5)
}

// ATTACK 
function hit() {
   if (walcze==1 && bije == 0){
      bije = 1
      document.querySelector(".wrogwalka").innerHTML += "<div class='wybuch'></div>"
      wskaznik.style.visibility = "hidden"
      setTimeout(()=>{
         document.querySelector(".wybuch").remove()
         document.querySelector(".postac").innerHTML += "<div class='wybuch'></div>"
      },600)
      setTimeout(()=>{
         document.querySelector(".wybuch").remove()
         if (walcze==1) {
            wskaznik.style.visibility = "visible"
         }
         bije = 0
      },1200)
      let dmg = wskaznik.style.left.slice(0, -1)
      if (dmg>=44.5 && dmg<=54) {
         zadajDmg(random(obrazenia-20,obrazenia))
         pochwal(1)
      }
      else if (dmg>=23.5 && dmg<44.5) {
         zadajDmg(random(obrazenia-30,obrazenia-20))
         pochwal(2)
      }
      else if (dmg>54 && dmg<=73.5) {
         zadajDmg(random(obrazenia-30,obrazenia-20))
         pochwal(2)
      }
      else {
         zadajDmg(random(obrazenia-40,obrazenia-30))
         pochwal(3)
      }
   }
}

// NOTIFICATION ABOUT HIT
function pochwal(x) {
   if (walcze==1) {
      let divDmg = document.querySelector(".dmg")
      document.querySelector(".dmg").style.visibility = "visible"
      styleDmg.remove("hidden")
      styleDmg.add("visible")
      if (x==1) {
         divDmg.innerHTML = "<a style='color:lime;'>Great!</a>"
      }
      else if (x==2) {
         divDmg.innerHTML = "<a style='color:gold;'>Nice!</a>"
      }
      else {
         divDmg.innerHTML = "<a style='color:red;'>Meh</a>"
      }
      divDmg.style.visibility = "visible"
      setTimeout(()=>{
         styleDmg.remove("visible")
         styleDmg.add("hidden")
         setTimeout(()=>{
            document.querySelector(".dmg").style.visibility = "hidden"
         },250)
      },950)
   }
}

function random(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

// DEAL DAMAGE
function zadajDmg(dmg) {
   hpEnemy -= dmg
   document.querySelector(".zycie").style.width = hpEnemy + "%"
   clearInterval(odbijaj)
   if (hpEnemy>0) {
      setTimeout(()=>{
         hp -= random(15,20)
         walka()
         update()
      },600)
   }
   else {
      styleWalka.add("hidden")
      styleWalka.remove("visible")
      xp += 120
      setTimeout(()=>{
         document.querySelector(".walka").style.visibility = "hidden"
         hpEnemy = 100
         document.querySelector(".zycie").style.width = hpEnemy + "%"
      },250)
      document.querySelector(".wrog"+String(wrogId)).remove()
      walcze = 0
      pokonani.push(wrogId)
      moznachodzic = 1
      mozna = 1
      drop()
      update()
   }
}

// DEATH
function umarles() {
   document.querySelector("body").innerHTML = "<div class='umarles'>GAME OVER</div>"
}

// LEVEL UP ANIMATION
function animacjaLevel() {
   let tak = 1
   let poziom = document.querySelector(".level")
   let interwal = setInterval(()=>{
      if (tak==1) {
         poziom.style.color = "yellow"
         tak = 0
      }
      else {
         poziom.style.color = "orange"
         tak = 1
      }
   },100)
   setTimeout(()=>{
      poziom.style.color = "white"
      clearTimeout(interwal)
   },1000)
}

// UPDATE STATS
function updateStaty() {
   maxHp += Math.floor(Math.sqrt(level)) * 20
   hp +=  Math.floor(Math.sqrt(level)) * 20
   maxXp += Math.floor(Math.sqrt(level)) * 20
   obrazenia += Math.floor(Math.sqrt(level)) * 5
}

// NOTIFICATION
function powiadomienie(text) {
   let powiad = document.querySelector(".powiadomienie")
   powiad.innerHTML = "<a>"+text+"</a>"
   document.querySelector(".powiadomienie").style.visibility = "visible"
   stylePowiadomienie.remove("hidden")
   stylePowiadomienie.add("visible")
   setTimeout(()=>{
      stylePowiadomienie.add("hidden")
      stylePowiadomienie.remove("visible")
      setTimeout(()=>{
         document.querySelector(".powiadomienie").style.visibility = "hidden"
      },250)
   },3000)
}

// RANDOM ITEM DROP
function drop() {
   if(random(1,2)==1) {
      let ok = 1
      document.querySelectorAll(".slotItem").forEach((slot)=>{
         if (slot.innerHTML == "" && ok == 1) {
            slot.innerHTML= "<div item='1' listener='0' class='item item1 pixel-art'></div>"
            update()
            ok = 0
         }
      })
      if (ok==0) {
         powiadomienie("You found a new item!")
      }
      if (ok==1) {
         powiadomienie("No more item space!")
      }
   }
}

// CREATE COLLISIONS
function sciana(lewo,gora,prawo,dol) {
   let scianaLewo = (lewo-1)*16 - 2
   let scianaPrawo = (prawo-1)*16 + 6
   let scianaGora = (gora-2)*16
   let scianaDol = (dol-2)*16 + 6

   if (x < scianaPrawo && x > scianaLewo) {    
      if(y > scianaGora && y < scianaDol) {      
         if (x < scianaPrawo && x == scianaPrawo - 1) {
            x = scianaPrawo
         }
         else if (x > scianaLewo && x == scianaLewo + 1) {
            x = scianaLewo
         }
         else if (y < scianaDol && y == scianaDol - 1){
            y = scianaDol
         }
         else if (y > scianaGora && y == scianaGora + 1){
            y = scianaGora
         }
      }
   }
}

// CREATE ENEMY
function wrog(lewo,gora,prawo,dol, idWroga) {
   let scianaLewo = (lewo-1)*16 - 2
   let scianaPrawo = (prawo-1)*16 + 6
   let scianaGora = (gora-2)*16
   let scianaDol = (dol-2)*16 + 6

   if (!pokonani.includes(idWroga))
      if (x < scianaPrawo && x > scianaLewo) {    
         if(y > scianaGora && y < scianaDol) {      
            if (x < scianaPrawo && x == scianaPrawo - 1) {
               moznachodzic = 0
               if (walcze==0) {
                  wrogId = idWroga
                  wskaznik.style.visibility = "visible"
                  walka()
               }
            }
            else if (x > scianaLewo && x == scianaLewo + 1) {
               moznachodzic = 0
               if (walcze==0) {
                  wrogId = idWroga
                  wskaznik.style.visibility = "visible"
                  walka()
               }
            }
            else if (y < scianaDol && y == scianaDol - 1){
               moznachodzic = 0
               if (walcze==0) {
                  wrogId = idWroga
                  wskaznik.style.visibility = "visible"
                  walka()
               }
            }
            else if (y > scianaGora && y == scianaGora + 1){
               moznachodzic = 0
               if (walcze==0) {
                  wrogId = idWroga
                  wskaznik.style.visibility = "visible"
                  walka()
               }
            }
         }
      }
}

// CREATE AN ENTERANCE
function przejscie(lewo,gora,prawo,dol,id) {
   let scianaLewo = (lewo-1)*16 - 2
   let scianaPrawo = (prawo-1)*16 + 6
   let scianaGora = (gora-2)*16
   let scianaDol = (dol-2)*16 + 6

   if (x < scianaPrawo && x > scianaLewo) {    
      if(y > scianaGora && y < scianaDol) {      
         if (x < scianaPrawo && x == scianaPrawo - 1) {
            zaladujMape(id)
         }
         else if (x > scianaLewo && x == scianaLewo + 1) {
            zaladujMape(id)
         }
         else if (y < scianaDol && y == scianaDol - 1){
            zaladujMape(id)
         }
         else if (y > scianaGora && y == scianaGora + 1){
            zaladujMape(id)
         }
      }
   }
}

// LOAD MAP
function zaladujMape(id) {
   idMapy = id

   if (id==1) {
      document.querySelector(".camera").innerHTML = "<div class='map"+id+" pixel-art'><div class='character' facing='up' walking='true'><div class='character_spritesheet pixel-art'></div></div>"
      character = document.querySelector(".character");
      map = document.querySelector(".map"+id);
      document.querySelector(".camera").style.backgroundColor = "#0a0000"
      x = 32;
      y = 78;
      leftLimit = -2;
      rightLimit = 68;
      topLimit = 24
      bottomLimit = 90
   }
   if (id==0) {
      document.querySelector(".camera").innerHTML = "<div class='map"+id+" pixel-art'><div class='character' facing='down' walking='true'><div class='character_spritesheet pixel-art'></div></div></div>"
      pokonani.forEach(x => {
         let indeks = wrogowie.indexOf(x)
         if (indeks !== -1) {
            wrogowie.splice(indeks, 1)
         }
      });
      wrogowie.forEach(x => {
         document.querySelector(".map"+id).innerHTML += "<div class='wrog wrog"+x+"'><div class='slime'></div></div>"
      })
      document.querySelector(".map"+id).innerHTML += "<div class='map0nad pixel-art'></div>"
      character = document.querySelector(".character");
      map = document.querySelector(".map"+id);
      document.querySelector(".camera").style.backgroundColor = "#61ddf7"
      x = 118;
      y = 76;
      leftLimit = 0;
      rightLimit = 16*28;
      topLimit = -8
      bottomLimit = 16*17
   }
}

// ENTER DEBUG MODE
document.querySelector(".debug").addEventListener("input", () => {
   if (document.querySelector(".debug").checked) {
      document.querySelector(".paski3").style.visibility = "visible"
   }
   else {
      document.querySelector(".paski3").style.visibility = "hidden"
   }
})