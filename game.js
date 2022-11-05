//TODO:
//1) when press feed, get bigger (get points from DB & save the change (size level) to DB)
//2) Evolution

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
// EVOLVE: when canvas_width = 100 & canvas_height = 200
CANVAS_WIDTH = canvas.width = 600;
CANVAS_HEIGHT = canvas.height = 1200;
let numberOfEnemies = 1;
const enemiesArray = [];

const THRESHOLD1 = 50
const THRESHOLD2 = 100
const THRESHOLD3 = 150


let gameFrame = 0;

const email = 'test'
//POST: send email (hardcoded)
// => GET: # of points 

const postData = async(email) => {
    try {
      let res = await fetch('https://ez-med.herokuapp.com/points', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'email': 'test'
        }),
      });
      res = await res.json();
      console.log(res)
      // if(res.Medicines){
      //   navigation.navigate('Home',{data:res.Medicines,email: email})
      // }
    } catch (e) {
      console.error(e);
    }
}

postData();

//getPoints();
//THIS IS HARDCODED
let data_points = 200;


class Enemy {
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy4.png';
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 2 * (data_points / 25);
        this.height = this.spriteHeight / 2 * (data_points / 25);
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.newX = Math.random() * canvas.width;
        this.newY = Math.random() * canvas.height;
        this.frame = 0; // which bat to choose from in the sprite
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.interval = Math.floor(Math.random() * 200 + 50); //each object has random interval for moving
    }
    update(){
        // for every 300 frames (time interval) 
        if (gameFrame % 300 === 0) {
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/70; // number > 20 => move slower
        this.y -= dy/70;

        if (this.x + this.width < 0) this.x = canvas.width;
        if (gameFrame % this.flapSpeed === 0){
            // run this only for 2 for loops
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    sizeup(){
        if (evolved3 == true){
            this.width = this.spriteWidth / 2 * ((data_points - THRESHOLD3) / 25);
            this.height = this.spriteHeight / 2 * ((data_points - THRESHOLD3) / 25);
        }
        else if (evolved2 == true){
            this.width = this.spriteWidth / 2 * ((data_points - THRESHOLD2) / 25);
            this.height = this.spriteHeight / 2 * ((data_points - THRESHOLD2) / 25);
        }
        else if (evolved1 == true){
            this.width = this.spriteWidth / 2 * ((data_points - THRESHOLD1) / 25);
            this.height = this.spriteHeight / 2 * ((data_points - THRESHOLD1) / 25);
        }
        else{
            this.width = this.spriteWidth / 2 * (data_points / 25);
            this.height = this.spriteHeight / 2 * (data_points / 25);
        }
    }

    draw(){
        ctx.drawImage(this.image, 
            this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, // area of crop from src picture
            this.x, this.y, this.width, this.height); // where in canvas to be drawn
    }
    evolve3(){
        this.image.src = 'enemy3.png';
        this.spriteWidth = 218;
        this.spriteHeight = 177;
    }
    evolve2(){
        this.image.src = 'enemy2.png';
        this.spriteWidth = 266;
        this.spriteHeight = 188;
    }
    evolve1(){
        this.image.src = 'enemy1.png';
        this.spriteWidth = 293;
        this.spriteHeight = 155;
    }
};

//create multiple enemies (objects)
for (let i=0; i<1; i++) {
    enemiesArray.push(new Enemy());
}

evolved1 = false
evolved2 = false
evolved3 = false

function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
        //when data point is increamented:
        if (data_points > THRESHOLD3 && evolved3 == false){
            enemy.evolve3();
            evolved3 = true;
            console.log('3');
        }
        else if (data_points > THRESHOLD2 && data_points <= THRESHOLD3 && evolved2 == false){
            enemy.evolve2();
            evolved2 = true;
            console.log('2', data_points);
        }
        else if (data_points > THRESHOLD1 && data_points <= THRESHOLD2 && evolved1 == false){
            enemy.evolve1();
            evolved1 = true;
            console.log('1');
        }
        enemy.sizeup();
    });

    gameFrame++;

    requestAnimationFrame(animate);
}
animate();


