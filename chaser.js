const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let ball = { x: 250, y: 150, radius: 25, color: "lemonchiffon" };
let mouse = { x: 0, y: 0 };

class Enemy {
  constructor(x, y, width, color) {
    Object.assign(this, {x, y, width, color});
  }
}

let enemies = [
  new Enemy(80, 200, 20, 'crimson'),
  new Enemy(200, 250, 17, 'orange'),
  new Enemy(150, 180, 22, 'mauve'),
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
  moveToward(mouse, ball, 0.05);
  enemies.forEach(enemy => moveToward(ball, enemy, 0.02));
}

function drawScene() {
  clearBackground();
  drawBall();

  enemies.forEach(drawEnemy);

  updateScene();
  requestAnimationFrame(drawScene);
}

requestAnimationFrame(drawScene);
