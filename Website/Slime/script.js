var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 1354;
canvas.height = 650;

var cursorX, cursorY;

var entities = [];

var keys = [];

var player = {
    name: prompt("Name:"),
    x: 100,
    y: 100,
    dx: 0,
    dy: 0,
    width: 56,
    height: 52,
    frameX: 0,
    frameY: 0,
    speed: 1,
    jumpForce: 5,
    moving: false,
    sprite: new Image(),
    animationState: 0,
        
    move: function(){
        if(keys[65]){
            this.dx = -this.speed;
            this.moving = true;
            this.frameY = 1;
        }
        if(keys[87]){
            this.dy = -this.jumpForce;    
        }
        if(keys[68]){
            this.dx = this.speed;
            this.moving = true;
            this.frameY = 0;
        }
        if(keys[83]){
            this.dy = this.jumpForce;
        }
    },
}

player.sprite.src = "KingSlime.png";

function Slime(x, y){
    this.name = "";
    this.random = Math.ceil(Math.random() * 7);
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.width = 56;
    this.height = 36;
    this.frameX = 0;
    this.frameY = 0;
    this.speed = 1;
    this.dir = 1;
    this.moving = true;
    this.sprite = new Image();
    if(this.random == 1){
        this.sprite.src = "GreenSlime.png";
        this.dir = 1;
    } else if(this.random == 2){
        this.sprite.src = "BlueSlime.png";
        this.dir = 1;
    } else if(this.random == 3){
        this.sprite.src = "OrangeSlime.png";    
        this.dir = -1;
        this.frameY = 1;
    } else if(this.random == 4){
        this.sprite.src = "RedSlime.png";    
        this.dir = -1;
        this.frameY = 1;
    } else if(this.random == 5){
        this.sprite.src = "PinkSlime.png";    
        this.dir = -1;
        this.frameY = 1;
    } else if(this.random == 6){
        this.sprite.src = "PurpleSlime.png";    
        this.dir = 1;
        this.frameY = 0;
    } else {
        this.sprite.src = "YellowSlime.png";    
        this.dir = -1;
        this.frameY = 1;
    }
    
    this.move = function(){
        if(this.x + this.width <= canvas.width && this.x >= 0){
            this.dx = this.speed * this.dir;    
        } else if(this.x + this.width > canvas.width){
            this.dir = -1;
            this.x = canvas.width - this.width;
            this.frameY = 1;
            this.dx = this.speed * this.dir;
        } else if(this.x < 0){
            this.dir = 1;
            this.x = 0;
            this.frameY = 0;
            this.dx = this.speed * this.dir;
        }
        
    }
    
    entities.push(this);
}
function animate(){
    player.move();
    
    for(var i = 0; i < entities.length; i++){
        entities[i].move();
    }
    
    player.x += player.dx;
    player.y += player. dy;
    
    for(var i = 0; i < entities.length; i++){
        entities[i].x += entities[i].dx;
        entities[i].y += entities[i].dy;
    }
    
    ctx.clearRect(0, 0, 1354, 650);
    for(var i = 0; i < entities.length; i++){
        ctx.drawImage(entities[i].sprite, entities[i].width * entities[i].frameX, entities[i].height * entities[i].frameY, entities[i].width, entities[i].height, entities[i].x, entities[i].y, entities[i].width, entities[i].height);
        if(entities[i].name != ""){
            ctx.font = "20px 'Fira Code', monospace";
            ctx.fillStyle = "black";
            ctx.fillText(entities[i].name, entities[i].x + 7.5 - (3 * entities[i].name.length), entities[i].y - 10);
        }
        
    }
    ctx.fillStyle = "#32CD32";
    ctx.fillRect(0, 600, 1354, 50);
    
    for(var i = 0; i < entities.length; i++){
        if(entities[i].moving == true){
            entities[i].frameX = 1 * Math.round(player.animationState);
        } else {
            entities[i].frameX = 0;    
        }
    }
    if(player.animationState <= 3){
        player.animationState += 0.04;    
    } else {
        player.animationState = 0;    
    }
    
    for(var i = 0; i < entities.length; i++){
        if(entities[i].y + entities[i].height < 600) {
            entities[i].dy += 1;
        }
        else if(entities[i].y + entities[i].height != 600){
            entities[i].dy = 0;
            entities[i].y = 600 - entities[i].height;     
        }
    }
    requestAnimationFrame(animate);
}
function name(entity){
    entity.name = prompt("Name:"); 
    if(entity.type == "")
    entity.sprite.src = prompt("Color:") + "Slime.png";    
}
function checkCoordinates(x, y){
    for(var i = 0; i < entities.length; i++){
        if(entities[i].x <= x && entities[i].x + entities[i].width >= x && entities[i].y <= y && entities[i].y + entities[i].height >= y){
            name(entities[i]);
            break;
        }
    }
}
window.addEventListener("keydown", function(e){
    keys[e.keyCode] = true;
});
window.addEventListener("keyup", function(e){
    player.moving = false;
    player.dx = 0;
    delete keys[e.keyCode];
});
window.addEventListener("click", (evt) => {
    cursorX = evt.clientX;
    cursorY = evt.clientY;
    checkCoordinates(cursorX, cursorY);
});
animate();
window.onload = function(){
    entities.push(player);
    for(var i = 0; i < 200; i++){
        new Slime(Math.random() * canvas.width, Math.random() * canvas.height);
    }
}