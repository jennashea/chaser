const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let ball = { x: 250, y: 150, dx: 3, dy: 5, radius: 20, color: "lemonchiffon" };
let enemy = { x: 250, y: 250, width: 30, color: "red" };
let mouse = { x: 0, y: 0 };
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}
document.body.addEventListener("mousemove", updateMouse);
function clearBackground() {
  ctx.fillStyle = "cadetblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawBall() {
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.strokeStyle = "royalblue";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();
}
function drawEnemy() {
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

function updateScene() {
  ball.x -= ball.dx;
  ball.y -= ball.dy;
  if (ball.y <= ball.radius || ball.y >= canvas.height - ball.radius) {
    ball.dy *= -1;
  }
  if (ball.x <= ball.radius || ball.x >= canvas.height - ball.radius) {
    ball.dx *= -1;
  }
}
function moveToward(leader, follower, speed){
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}
function updateSceneWithMouse() {
  moveToward(mouse,ball,0.2);
  moveToward(ball,enemy,0.05)
}
let x = 250;
function drawScene() {
  clearBackground();
  drawBall();
  drawEnemy();
  updateSceneWithMouse();
  requestAnimationFrame(drawScene);
}

requestAnimationFrame(drawScene);
