var character = document.getElementById("character");
var cactus = document.getElementById("cactus");
var sun = document.getElementById("sun");
var ground = document.getElementById("ground");
var text = document.getElementById("text");
var score = document.getElementById("score");
var highscore = document.getElementById("highscore");
var highest = 0;
var distance = 0;
var alive = true;
var rand = Math.floor(Math.random() * 1000);
var money = document.getElementById("money");
var cash = 0;
var cloudySky = document.getElementById("cloudySky");
var grass = document.getElementById("grass");
var game = document.getElementById("game");
var desertSky = document.getElementById("desertSky");
var desertSkyBtn = document.getElementById("desertSkyBtn");
var cloudySkyBtn = document.getElementById("cloudySkyBtn");
var dGround = document.getElementById("dGround");
var dGroundBtn = document.getElementById("dGroundBtn");
var grassBtn = document.getElementById("grassBtn");
var usingDSky = true;
var cSkyBought = false;
var usingCSky = false;
var grassBought = false;
var usingGrass = false;
var usingDGround = true;


function jump(){
    if(character.classList != "animate"){
        character.classList.add("animate");
    }
    setTimeout(function(){
    character.classList.remove("animate")
    }, 500);
}
function play(){
    var checkLost = setInterval(function(){
        var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
        var blockLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));
        if(blockLeft < 75 && blockLeft > 0 && characterTop >= 130){
            cactus.style.animation = "none";
            cactus.style.display = "none";
            sun.style.animation = "none";
            sun.style.display = "none";
            ground.style.display = "none";
            text.innerHTML = "You lost. :(";       
            alive = false;
            setTimeout(function(){
                if(alive == false){
                    cactus.style.animation = "block 1s infinite linear";
                    cactus.style.display = "block";
                    sun.style.animation = "move 20s infinite linear";
                    sun.style.display = "block";
                    ground.style.display = "block";
                    text.innerHTML = "";       
                    alive = true;
                    if(distance >= highest){
                        highest = distance;
                        highscore.innerHTML = "highscore: " + highest;
                        highscore.classList.add("flashy");
                        setTimeout(function(){
                            highscore.classList.remove("flashy");
                        }, 3000);
                    }
                    distance = 0;
                }
            }, 4000);
        }
    }, 10);
    setInterval(function(){
        if(alive == true){
            distance++;
        }    
    }, 20);
    
    setInterval(function(){    
        if(alive == true){
            score.innerHTML = "score: " + distance;    
        }
    }, 20);
    setInterval(function(){ 
        rand = Math.floor(Math.random() * 1000);
        
        if(rand < 900){
            if(alive == true){
                cash = cash + 2;
                money.innerHTML = "$" + cash;
                cactus.style.backgroundColor = "#4ef013";
            }
        } else if(rand >= 900 && rand < 990){
            if(alive == true){
                cash = cash + 20;
                money.innerHTML = "$" + cash;
                cactus.style.backgroundColor = "purple";
            }
        } else if(rand >= 990 && rand < 999){
            if(alive == true){
                cash = cash + 200;
                money.innerHTML = "$" + cash;
                cactus.style.backgroundColor = "gold";
            }        
        } else if(rand >= 999){
            if(alive == true){
                cash = cash + 2000;
                money.innerHTML = "$" + cash;
                cactus.style.backgroundColor = "DeepPink";
            }    
        }    
    }, 1000);
}
function useCloudySky(){
    if(cash >= 500 && usingCSky == false){
        cash = cash - 500;
        game.style.backgroundImage = "url(sky2.jpeg)";
        cSkyBought = true;
        usingCSky = true;
        usingDSky = false;
        cloudySky.innerHTML = "Cloudy Sky [Using]";
        cloudySkyBtn.style.display = "none";
        desertSky.innerHTML = "Desert Sky";
        desertSkyBtn.style.display = "block";
    } else if(usingDSky == true && cSkyBought == true){
        game.style.backgroundImage = "url(sky2.jpeg)";
        cSkyBought = true;
        usingCSky = true;
        usingDSky = false;
        cloudySky.innerHTML = "Cloudy Sky [Using]";
        cloudySkyBtn.style.display = "none";
        desertSky.innerHTML = "Desert Sky";
        desertSkyBtn.style.display = "block";    
    }
}
function useDesertSky(){
    if(usingCSky == true){
        game.style.backgroundImage = "url(sky.jpeg)";
        usingCSky = false;
        usingDSky = true;
        desertSky.innerHTML = "Desert Sky [Using]";
        desertSkyBtn.style.display = "none";
        cloudySkyBtn.innerHTML = "Use";
        cloudySky.innerHTML = "Cloudy Sky";
        cloudySkyBtn.style.display = "block";
    }
}
function useGrass(){
    if(cash >= 300 && grassBought == false){
        cash = cash - 300;
        grassBought = true;
        usingGrass = true;
        usingDGround = false;
        grass.innerHTML = "Grass [In Using]";
        grassBtn.style.display = "none";
        dGroundBtn.innerHTML = "Use";
        dGround.innerHTML = "Desert Ground";
        ground.style.backgroundColor = "green";
        dGroundBtn.style.display = "block";
    } else if(usingDGround == true && grassBought == true){
        usingGrass = true;
        usingDGround = false;
        grass.innerHTML = "Grass [Using]";
        grassBtn.style.display = "none";
        dGroundBtn.innerHTML = "Use";
        dGround.innerHTML = "Desert Ground";
        ground.style.backgroundColor = "green";
        dGroundBtn.style.display = "block";    
    }
}
function useDGround(){
    if(usingGrass == true){
        ground.style.backgroundColor = "#ffcc00";
        usingGrass = false;
        usingDGround = true;
        dGround.innerHTML = "Desert Ground [Using]";
        dGroundBtn.style.display = "none";
        grassBtn.innerHTML = "Use";
        grass.innerHTML = "Grass";
        grassBtn.style.display = "block";        
    }
}

play();

                     













                            