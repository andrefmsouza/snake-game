class SnakeGame {
    constructor() {
        this.config = {
            canvasWidth: 400,
            canvasHeight: 400,
            velocity: 1,
            gameSpeed: 80,
            pieceSize: 20,
            initialTail: 5
        };

        this.state = {
            velocityX: 0,
            velocityY: 0,
            positionX: 15,
            positionY: 15,
            appleX: 0,
            appleY: 0,
            trail: [],
            tail: this.config.initialTail,
            direction: "",
            score: 0,
            gameInterval: null
        };

        // Elementos do DOM
        this.canvas = document.getElementById("stage");
        this.ctx = this.canvas.getContext("2d");

        // Configuração inicial do canvas
        this.canvas.width = this.config.canvasWidth;
        this.canvas.height = this.config.canvasHeight;

        // Bindings
        this.keyEvent = this.keyEvent.bind(this);
        this.start = this.start.bind(this);
        this.runGame = this.runGame.bind(this);

        // Inicialização
        this.init();
    }

    init() {
        document.addEventListener("keydown", this.keyEvent);
        
        // Configurar botões de controle
        document.querySelectorAll('.control-btn').forEach(btn => {
            if (btn.dataset.direction) {
                btn.addEventListener('click', () => this.handleDirectionButton(btn.dataset.direction));
            }
        });

        // Configurar botão de reiniciar
        document.querySelector('.restart-btn').addEventListener('click', () => {
            // Limpar o intervalo existente
            if (this.state.gameInterval) {
                clearInterval(this.state.gameInterval);
                this.state.gameInterval = null;
            }
            
            // Reiniciar o jogo
            this.start();
        });

        // Iniciar jogo
        this.start();
    }

    start() {
        // Resetar estado
        this.state = {
            velocityX: 0,
            velocityY: 0,
            positionX: 15,
            positionY: 15,
            appleX: Math.floor(Math.random() * (this.config.canvasWidth / this.config.pieceSize)),
            appleY: Math.floor(Math.random() * (this.config.canvasHeight / this.config.pieceSize)),
            trail: [],
            tail: this.config.initialTail,
            direction: "",
            score: 0,
            gameInterval: null
        };

        // Limpar intervalo anterior se existir
        if (this.state.gameInterval) {
            clearInterval(this.state.gameInterval);
        }

        // Iniciar novo intervalo
        this.state.gameInterval = setInterval(this.runGame, this.config.gameSpeed);
    }

    runGame() {
        this.state.positionX += this.state.velocityX;
        this.state.positionY += this.state.velocityY;

        //Canvas border
        if( this.state.positionX < 0 ){
            this.state.positionX = this.config.canvasWidth / this.config.pieceSize - 1;
        }

        if( this.state.positionX > this.config.canvasWidth / this.config.pieceSize - 1 ){
            this.state.positionX = 0;
        }

        if( this.state.positionY < 0 ){
            this.state.positionY = this.config.canvasWidth / this.config.pieceSize - 1;
        }

        if( this.state.positionY > this.config.canvasWidth / this.config.pieceSize - 1 ){
            this.state.positionY = 0;
        }

        //Stage
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        //Apple
        this.ctx.fillStyle = "red";
        this.ctx.fillRect( this.state.appleX * this.config.pieceSize, this.state.appleY * this.config.pieceSize, this.config.pieceSize, this.config.pieceSize);

        //Snake
        this.ctx.fillStyle = "gray";
        for(let i = 0; i < this.state.trail.length; i++){
            this.ctx.fillRect( this.state.trail[i].x * this.config.pieceSize, this.state.trail[i].y * this.config.pieceSize, this.config.pieceSize - 1, this.config.pieceSize - 1);

            //Game Over
            if( this.state.trail[i].x == this.state.positionX && this.state.trail[i].y == this.state.positionY ){
                this.state.velocityX = this.state.velocityY = 0;
                this.state.tail = this.config.initialTail;
            }
        }

        this.state.trail.push({x: this.state.positionX, y: this.state.positionY});
        //Remove the tail end
        while(this.state.trail.length > this.state.tail){
            this.state.trail.shift();
        }

        //Snake eats the apple
        if( this.state.appleX == this.state.positionX && this.state.appleY == this.state.positionY ){
            this.state.tail++;
            this.state.appleX = Math.floor( Math.random() * this.config.canvasWidth / this.config.pieceSize );
            this.state.appleY = Math.floor( Math.random() * this.config.canvasWidth / this.config.pieceSize );
        }
    }

    keyEvent(event) {
        this.controlSnake(event.keyCode);
    }

    controlSnake(keyCode) {
        switch (keyCode) {
            case 37: // Left
                if( this.state.direction == "right") return;
                this.state.direction = "left";
                this.state.velocityX = -this.config.velocity;
                this.state.velocityY = 0;
                break;
            case 38: // up
                if( this.state.direction == "down") return;
                this.state.direction = "up";
                this.state.velocityX = 0;
                this.state.velocityY = -this.config.velocity;
                break;
            case 39: // right
                if( this.state.direction == "left") return;
                this.state.direction = "right";
                this.state.velocityX = this.config.velocity;
                this.state.velocityY = 0;
                break;
            case 40: // down
                if( this.state.direction == "up") return;
                this.state.direction = "down";
                this.state.velocityX = 0;
                this.state.velocityY = this.config.velocity;
                break;          
            default:
                
                break;
        }
    }

    handleDirectionButton(direction) {
        this.controlSnake(this.getDirectionKeyCode(direction));
    }

    getDirectionKeyCode(direction) {
        switch (direction) {
            case "up":
                return 38;
            case "left":
                return 37;
            case "right":
                return 39;
            case "down":
                return 40;
            default:
                return null;
        }
    }
}

// Inicializar o jogo
const game = new SnakeGame();