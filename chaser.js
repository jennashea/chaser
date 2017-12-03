const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
const button = document.querySelector("button");
const playerDimensions= 64;

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

class Sprite {
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "salmon";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  hasCollided(sprite2) {
    return distanceBetween(this ,sprite2) < this.radius + sprite2.radius;
  }
    
}
class Player extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    this.image = new Image();
    this.image.src = "https://res.cloudinary.com/misclg/image/upload/v1512336321/mikuSprite_znz98t.png";
    Object.assign(this, {x, y, radius, color, speed});
  }
    
  draw() {
    /*HIT BOX 
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "indianred";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
    */
    ctx.drawImage(this.image, this.x - playerDimensions*2/3, this.y-playerDimensions/2, playerDimensions, playerDimensions);
  }
}

let player = new Player(250, 150, playerDimensions/3, 'lemonchiffon', 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    Object.assign(this, { x, y, radius, color, speed });
  }
}

let enemies = [
  new Enemy(80, 200, 20, "rgba(250,1,180,0.9)", 0.02),
  new Enemy(200, 250, 17, "rgba(50,200,70,0.7)", 0.01),
  new Enemy(150, 180, 22, "rgba(80,200,190,0.4)", 0.05)
];

let mouse = { x: 0, y: 0 };
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}
document.body.addEventListener("mousemove", updateMouse);
function clearBackground() {
  ctx.fillStyle = "wheat";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}
function updateScene() {
  moveToward(mouse, player, player.speed);
  enemies.forEach(enemy => moveToward(player, enemy, enemy.speed));
  enemies.forEach(enemy => {
    if (enemy.hasCollided(player)) {
      progressBar.value -= 2;
    }
  });
}

function endScene(){
   if (progressBar.value <= 0) {
   //alert('Game over');
   } else {
     requestAnimationFrame(drawScene);
   }
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
  endScene();
}

requestAnimationFrame(drawScene);

button.addEventListener("click", drawScene);
