const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class Sprite {
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

class Player extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    Object.assign(this, {x, y, radius, color, speed});
  }
}

let player = new Player(250, 150, 15, 'lemonchiffon', 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    Object.assign(this, {x, y, radius, color, speed});
  }
}

let enemies = [
  new Enemy(80, 200, 20, 'rgba(250, 0, 50, 0.8)', 0.02),
  new Enemy(200, 250, 17, 'rgba(200, 100, 0, 0.7)', 0.01),
  new Enemy(150, 180, 22, 'rgba(50, 10, 70, 0.5)', 0.002),
];


let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}


function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function updateScene() {
  moveToward(mouse, player, player.speed);
  enemies.forEach(enemy => moveToward(player, enemy, enemy.speed));
}

function clearBackground() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
  requestAnimationFrame(drawScene);
}

requestAnimationFrame(drawScene);
