/*Script*/{

    document.addEventListener("keydown",function(e){
        if (e.key.toLowerCase() == "shift") {
            if (paused == 1) {
                player.active = false
                paused *= -1
            }
            else {
                player.active = true
                paused *= -1
            }
            
        }
    })

    window.addEventListener('resize',e => {
        document.querySelector("canvas").width = window.innerWidth
        document.querySelector("canvas").height = window.innerHeight
    })
    
    {//Window Setup
        //Canvas Varibles
        var canvas;
        var ctx;
    
        //Input Varibles
        var upKey;
        var rightKey;
        var downKey;
        var leftKey;
    
        //Game vars
        var gameLoop;
        var player;
        var borders = [];
        var paused = 1

        const body = document.querySelector("body")
        const head = document.querySelector("head")
    
    
        //Run once page has loaded
        window.onload = function() {
            body.style.margin = 0
            body.style.overflow = "hidden"

            var c = document.createElement("canvas")
            c.height = window.innerHeight
            c.width = window.innerWidth
            body.appendChild(c)

            //Assign vars
            canvas = document.querySelector("canvas");
            ctx = canvas.getContext("2d");
    
            //Setup Key Listeners
            setupInputs();
    
            //Create Player
            player = new Player(window.innerWidth/2,0)
    
            //Create Borders
            for (let i = 0; i < 6; i++) {
                borders.push(new Border(0 + 100* i, 620, 100, 100, 100, 1))
            }
    
            //Start Game Loop (Animation)
            gameLoop = setInterval(step, 1000/60);
    
    
            //Drawing
            ctx.fillStyle = "white";
            ctx.fillRect(0,0,1280,720);
        }
        function step() {
            //Step player
            player.step();
    
            //Draw Everthing
            draw();
    
        }
        function draw() {
            //Clear
            ctx.fillStyle = "white";
            ctx.fillRect(0,0,1280,720);
    
            //Draw Player
            player.draw();
    
            //Draw Border
            for (let i = 0; i < borders.length; i++) {
                borders[i].draw();
            }
    
        }
    
        function setupInputs() {
            document.addEventListener("keydown", function(event) {
                if (event.key === "w" || event.key === "ArrowUp") {
                    upKey = true; 
                } else if (event.key === "a" || event.key === "ArrowLeft") {
                    leftKey = true;
                } else if (event.key === "s" || event.key === "ArrowDown") {
                    downKey = true;
                } else if (event.key === "d" || event.key === "ArrowRight") {
                    rightKey = true;
                }
            });
            document.addEventListener("keyup", function(event) {
                if (event.key === "w" || event.key === "ArrowUp") {
                    upKey = false; 
                } else if (event.key === "a" || event.key === "ArrowLeft") {
                    leftKey = false;
                } else if (event.key === "s" || event.key === "ArrowDown") {
                    downKey = false;
                } else if (event.key === "d" || event.key === "ArrowRight") {
                    rightKey = false;
                }
            });
        }
    }
    
    {//Player.js
        function Player(x, y) {
            this.x = x;
            this.y = y;
            this.xspeed = 0;
            this.yspeed = 0;
            this.friction = 0.6;
            this.maxSpeed = 10;
            this.active = true;
            this.width = 50;
            this.height = 100;
    
            this.step = function() {
                //Movement
                if (this.active) {
                    //Horizontal
                    if (!leftKey && !rightKey || leftKey && rightKey) {
                        //Slow Down
                        this.xspeed *= this.friction;
                    } else if (rightKey) {
                        //right
                        this.xspeed++;
                    } else if(leftKey) {
                        //left
                        this.xspeed--;
                    }
                    //Vertical
                    if (upKey) {
                        //Check on ground
    
                        this.yspeed -= 15;
    
                    }
                    //Gravity
                    this.yspeed += 1;
    
                    //Correct Speed
                    if (this.xspeed > this.maxSpeed) {
                        this.xspeed = this.maxSpeed;
                    } else if (this.xspeed < -this.maxSpeed) {
                        this.xspeed = -this.maxSpeed;
                    }
                    if (this.yspeed > this.maxSpeed) {
                        this.yspeed = this.maxSpeed;
                    } else if (this.yspeed < -this.maxSpeed) {
                        this.yspeed = -this.maxSpeed;
                    }
    
                    this.x += this.xspeed;
                    if (this.y > window.innerHeight-this.height) {
                        this.y += 0
                    }
                    else {
                        if (this.y + this.yspeed > window.innerHeight-this.height) {
                            this.y = window.innerHeight-this.height - this.yspeed
                        }
                        this.y += this.yspeed
                    }
                    if (this.y < 0) {
                        this.y = 0
                    }

                    
                }
            }
    
            this.draw = function() {
                ctx.fillStyle = "green";
                ctx.fillRect(this.x, this.y, this.width, this.height)
            }
        }
    
    }
    
    {//Border.js
        function Border(x,y,width,height,type) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.type = type;
    
            this.draw = function() {
                if (this.type === 1) {
                    ctx.fillStyle = "blue";
                } else if (this.type == 2) {
                    ctx.fillStyle = "red";;
                }
                ctx.fillRect(this.x, this.y, this.width, this.height)
            }
        }
    }
    
    }