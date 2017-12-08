const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
const button = document.querySelector("button");
const defaultCharacterDimensions = 64;
const defaultPowerUpDimensions =64;
const playerDimensions = 64;
const enemyDimensions = 64;
let points = 0;
let scoreMultiplier = 1;
let time = 0;

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}
class Sprite {
  draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.hitBoxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "salmon";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.drawImage(
      this.image,
      this.x - this.dimensions / this.centerLineFraction,
      this.y - this.dimensions / 2,
      this.dimensions,
      this.dimensions
    );
  }
  hasCollided(sprite2) {
    return (
      distanceBetween(this, sprite2) < this.hitBoxRadius + sprite2.hitBoxRadius
    );
  }
}
class PowerUp extends Sprite {

}
class Player extends Sprite {
  constructor(x, y, hitBoxRadius, color, speed) {
    super();
    this.image = new Image();
    this.image.src =
      "http://res.cloudinary.com/misclg/image/upload/v1512342979/mikuSprite_Left.png";
    this.dimensions = defaultCharacterDimensions;
    this.centerLineFraction=3;
    Object.assign(this, { x, y, hitBoxRadius, color, speed });
  }
}

let player = new Player(250, 150, playerDimensions / 3, "lemonchiffon", 0.07);

class Enemy extends Sprite {
  constructor(x, y, hitBoxRadius, color, speed) {
    super();
    this.image = new Image();
    this.image.src =
      "http://res.cloudinary.com/randomstuff/image/upload/v1512513576/VirusSprite_qmtkaq.png";
    this.dimensions = defaultCharacterDimensions;
    this.centerLineFraction =2;
    Object.assign(this, { x, y, hitBoxRadius, color, speed });
  }
}

let enemies = [];

class ScoreFactor extends PowerUp {
  constructor(x, y, hitBoxRadius, color) {
    super();
    Object.assign(this, { x, y, hitBoxRadius, color });
    this.image = new Image();
    this.image.src =
      "http://res.cloudinary.com/misclg/image/upload/v1512363142/PowerUpSprite_Leek.png";
    this.dimensions = defaultPowerUpDimensions;
    this.centerLineFraction=2;
  }
  activate() {
    scoreMultiplier++;
  }
  erase() {
    let eraseIndex = scoreFactors.indexOf(this);
    scoreFactors.splice(eraseIndex, 1);
  }
}

let scoreFactors = [];

class EnemyEraser extends PowerUp {
  constructor(x, y, hitBoxRadius, color) {
    super();
    Object.assign(this, { x, y, hitBoxRadius, color });
  }
  activate() {
    enemies.pop();
  }
  erase() {
    let eraseIndex = enemyErasers.indexOf(this);
    enemyErasers.splice(eraseIndex, 1);
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.hitBoxRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "salmon";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

let enemyErasers = [];

class Health extends PowerUp {
  constructor(x, y, hitBoxRadius, color) {
    super();
    Object.assign(this, { x, y, hitBoxRadius, color });
    this.image = new Image();
    this.image.src =
      "http://res.cloudinary.com/misclg/image/upload/v1512580030/PowerUpSprite_Health.png";
    this.dimensions = defaultPowerUpDimensions;
    this.centerLineFraction=2;
  }
  activate() {
    progressBar.value += 10;
  }
  erase() {
    let healthIndex = healthPower.indexOf(this);
    healthPower.splice(healthIndex, 1);
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.hitBoxRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "mediumpurple";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

let healthPower = [];

class freezeEnemy extends PowerUp {
  constructor(x, y, hitBoxRadius, color) {
    super();
    Object.assign(this, { x, y, hitBoxRadius, color });
    this.image = new Image();
    this.image.src =
      "http://res.cloudinary.com/misclg/image/upload/v1512623984/PowerUpSprite_Snowflake.png";
    this.dimensions = defaultPowerUpDimensions;
    this.centerLineFraction=2;
  }
  activate() {
    let currentTime = time;
    while(time<= (currentTime+10)){
      enemies.forEach(enemy => enemy.speed =0);
    }
  }
  erase() {
    let freezeIndex = freezeEnemies.indexOf(this);
    freezeEnemies.splice(freezeIndex, 1);
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.hitBoxRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "sienna";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

let freezeEnemies = [];

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
  scoreFactors.forEach(scoreFactor => {
    if (scoreFactor.hasCollided(player)) {
      scoreFactor.activate();
      scoreFactor.erase();
    }
  });
  enemyErasers.forEach(enemyEraser => {
    if (enemyEraser.hasCollided(player)) {
      enemyEraser.activate();
      enemyEraser.erase();
    }
  });
  healthPower.forEach(healthPowerI => {
    if (healthPowerI.hasCollided(player)) {
      healthPowerI.activate();
      healthPowerI.erase();
    }
  });
  freezeEnemies.forEach(freezeEnemy1 => {
    if (freezeEnemy1.hasCollided(player)) {
      freezeEnemy1.activate();
      freezeEnemy1.erase();
    }
  });
}
function endScene() {
  if (progressBar.value <= 0) {
    //alert('Game over');
  } else {
    requestAnimationFrame(drawScene);
  }
}
function drawScene() {
  clearBackground();
  enemies.forEach(enemy => enemy.draw());
  scoreFactors.forEach(scoreFactor => scoreFactor.draw());
  enemyErasers.forEach(enemyEraser => enemyEraser.draw());
  healthPower.forEach(healthPowerUp => healthPowerUp.draw());
  freezeEnemies.forEach(freezeEnemyI => freezeEnemyI.draw());
  player.draw();
  updateScene();
  endScene();
}

function spawnEnemy() {
  enemies.unshift(
    new Enemy(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      20,
      "blue",
      Math.random() * (player.speed - player.speed / 30)
    )
  );
}

function spawnScoreFactor() {
  scoreFactors.unshift(
    new ScoreFactor(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      15,
      "green"
    )
  );
}

function spawnEnemyEraser() {
  enemyErasers.unshift(
    new EnemyEraser(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      8,
      "purple"
    )
  );
}

function spawnHealth() {
  healthPower.unshift(
    new Health(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      8,
      "royalblue"
    )
  );
}

function spawnFreeze() {
  freezeEnemies.unshift(
    new freezeEnemy(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      8,
      "aquamarine"
    )
  );
}

function IncreaseScore() {
  if (progressBar.value > 0) {
    let pointIncrease = 10 * scoreMultiplier;
    points += pointIncrease;
    document.getElementById("score").innerHTML = points;
  }
}
function IncreaseTime() {
  if (progressBar.value > 0) {
    time++;
  };
};

const spawnEnemies = setInterval(spawnEnemy, 3000);
const spawnScoreFactors = setInterval(spawnScoreFactor, 5000);
const spawnEnemyErasers = setInterval(spawnEnemyEraser, 4000);
const spawnHealths = setInterval(spawnHealth, 4500);
const spawnFreezes = setInterval(spawnFreeze, 5500);
const score = setInterval(IncreaseScore, 1000);
const addSeconds = setInterval(IncreaseTime,1000);


requestAnimationFrame(drawScene);
