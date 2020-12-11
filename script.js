window.onload = start;

const canvasWidth = 400;
const canvasHeight = 400;
const velocity = 1;
const gameSpeed = 80;

var canvas;
var ctx;
var velocityX = velocityY = 0;
var positionX = 15;
var positionY = 15;
var pieceSize = Math.floor( canvasWidth / 20 );
var quantityPieces = Math.floor( canvasWidth / 20 );
var appleX = appleY = 0;
var trail = [];
var tail = 5;
var direction = "";
var gameInterval = null;

document.addEventListener("keydown", keyEvent);

function start(){
    //Firts time
    if( !canvas && !ctx){
        canvas = document.getElementById("stage");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx = canvas.getContext("2d");
    }


    velocityX = velocityY = 0;
    positionX = 15;
    positionY = 15;
    trail = [];
    tail = 5;

    appleX = Math.floor( Math.random() * quantityPieces );
    appleY = Math.floor( Math.random() * quantityPieces );

    console.log(appleX, appleY);
    
    if(gameInterval != null) clearInterval(gameInterval);

    gameInterval = setInterval(runGame, gameSpeed);
}

function runGame(){
    positionX += velocityX;
    positionY += velocityY;

    //Canvas border
    if( positionX < 0 ){
        positionX = quantityPieces - 1;
    }

    if( positionX > quantityPieces - 1 ){
        positionX = 0;
    }

    if( positionY < 0 ){
        positionY = quantityPieces - 1;
    }

    if( positionY > quantityPieces - 1 ){
        positionY = 0;
    }


    //Stage
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Apple
    ctx.fillStyle = "red";
    ctx.fillRect( appleX * pieceSize, appleY * pieceSize, pieceSize, pieceSize);

    //Snake
    ctx.fillStyle = "gray";
    for(let i = 0; i < trail.length; i++){
        ctx.fillRect( trail[i].x * pieceSize, trail[i].y * pieceSize, pieceSize - 1, pieceSize - 1);

        //Game Over
        if( trail[i].x == positionX && trail[i].y == positionY ){
            velocityX = velocityY = 0;
            tail = 5;
        }
    }

    trail.push({x: positionX, y: positionY});
    //Remove the tail end
    while(trail.length > tail){
        trail.shift();
    }

    //Snake eats the apple
    if( appleX == positionX && appleY == positionY ){
        tail++;
        appleX = Math.floor( Math.random() * quantityPieces );
        appleY = Math.floor( Math.random() * quantityPieces );
    }
}

function keyEvent(event){
    controlSnake(event.keyCode);
}

function controlSnake(keyCode){
    switch (keyCode) {
        case 37: // Left
            if( direction == "right") return;
            direction = "left";
            velocityX = -velocity;
            velocityY = 0;
            break;
        case 38: // up
            if( direction == "down") return;
            direction = "up";
            velocityX = 0;
            velocityY = -velocity;
            break;
        case 39: // right
            if( direction == "left") return;
            direction = "right";
            velocityX = velocity;
            velocityY = 0;
            break;
        case 40: // down
            if( direction == "up") return;
            direction = "down";
            velocityX = 0;
            velocityY = velocity;
            break;          
        default:
            
            break;
    }
}