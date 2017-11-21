const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let ball = {
  x: 250,
  y: 150,
  radius: 15,
  color: "lemonchiffon",
  speed: 0.07
};
let mouse = { x: 0, y: 0 };

class Enemy {
  constructor(x, y, width, color, speed) {
    Object.assign(this, {x, y, width, color, speed});
  }
}

let enemies = [
  new Enemy(80, 200, 20, 'rgba(250,0,50,0.2)', 0.02),
  new Enemy(200, 250, 17, 'rgba(200,100,70,0.7)', 0.01),
  new Enemy(150, 180, 22, 'rgba(50,10,70,0.5)', 0.002),
];

function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

document.body.addEventListener("mousemove", updateMouse);

function clearBackground() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBall() {
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawEnemy(enemy) {
  ctx.fillStyle = enemy.color;
  ctx.fillRect(
    enemy.x - enemy.width / 2,
    enemy.y - enemy.width / 2,
    enemy.width,
    enemy.width
  );
  ctx.strokeRect(
    enemy.x - enemy.width / 2,
    enemy.y - enemy.width / 2,
    enemy.width,
    enemy.width
  );
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function updateScene() {
  moveToward(mouse, ball, ball.speed);
  enemies.forEach(enemy => moveToward(ball, enemy, enemy.speed));
}

function drawScene() {
  clearBackground();
  drawBall();
  enemies.forEach(drawEnemy);
  updateScene();
  requestAnimationFrame(drawScene);
}

requestAnimationFrame(drawScene);
