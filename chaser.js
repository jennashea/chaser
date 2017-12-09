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
let drawHitBox =false;
let time = 0;

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}
class Sprite {
  draw() {
      if (drawHitBox) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.hitBoxRadius, 0, Math.PI * 2);
          ctx.strokeStyle = "salmon";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.stroke();
        }
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
    pushOff(sprite2) {
    let [dx, dy] = [sprite2.x - this.x, sprite2.y - this.y];
    const L = Math.hypot(dx, dy);
    let distToMove = this.hitBoxRadius + sprite2.hitBoxRadius - L;
    if (distToMove > 0) {
      dx /= L;
      dy /= L;
      this.x -= dx * distToMove / 2;
      this.y -= dy * distToMove / 2;
      sprite2.x += dx * distToMove / 2;
      sprite2.y += dy * distToMove / 2;
    }
  }
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
    pushOff(sprite2) {
    let [dx, dy] = [sprite2.x - this.x, sprite2.y - this.y];
    const distance = this.hitBoxRadius + sprite2.hitBoxRadius;
    if (this.hasCollided(sprite2)) {
      sprite2.x += 4 * sprite2.hitBoxRadius * dx / distance;
      sprite2.y += 4 * sprite2.hitBoxRadius * dy / distance;
    }
  }
}

let player = new Player(
  250,
  150,
  defaultCharacterDimensions / 3,
  "lemonchiffon",
  0.07
);

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

function findIndexOfFastestEnemy() {
  let enemySpeeds = enemies.map(enemy => enemy.speed);
  return enemySpeeds.indexOf(Math.max(...enemySpeeds));
}

class PowerUp extends Sprite {
    deleteSelf() {
        let eraseIndex = powerUps[this.powerUpType].objects.indexOf(this);
        powerUps[this.powerUpType].objects.splice(eraseIndex, 1);
    }
}

const powerUps = {
  scoreFactor: { objects: [], hitBoxColor: "green" },
  enemyEraser: { objects: [], hitBoxColor: "purple" },
  health: { objects: [], hitBoxColor: "mediumpurple" }
};

class ScoreFactor extends PowerUp {
  constructor(x, y, hitBoxRadius, color) {
    super();
    Object.assign(this, { x, y, hitBoxRadius, color });
    this.image = new Image();
    this.image.src =
      "http://res.cloudinary.com/misclg/image/upload/v1512363142/PowerUpSprite_Leek.png";
    this.dimensions = defaultPowerUpDimensions;
    this.centerLineFraction=2;
    this.powerUpType = "scoreFactor";
  }
  activate() {
    scoreMultiplier++;
  }
}

class EnemyEraser extends PowerUp {
  constructor(x, y, hitBoxRadius, color) {
    super();
    Object.assign(this, { x, y, hitBoxRadius, color });
      this.image = new Image();
    this.image.src =
      "http://res.cloudinary.com/misclg/image/upload/v1512616230/PowerUpSprite_Harisen.png";
    this.dimensions = defaultPowerUpDimensions;
    this.centerLineFraction = 2;
    this.powerUpType = "enemyEraser";
  }
  activate() {
    enemies.splice(findIndexOfFastestEnemy(), 1);
  }
}


class Health extends PowerUp {
  constructor(x, y, hitBoxRadius, color) {
    super();
    Object.assign(this, { x, y, hitBoxRadius, color });
    this.image = new Image();
    this.image.src =
      "http://res.cloudinary.com/misclg/image/upload/v1512689192/PowerUpSprite_Health.png";
    this.dimensions = defaultPowerUpDimensions;
    this.centerLineFraction = 2;
    this.powerUpType = "health";
  }
  activate() {
    progressBar.value += 10;
  }
}


// class freezeEnemy extends PowerUp {
//   constructor(x, y, hitBoxRadius, color) {
//     super();
//     Object.assign(this, { x, y, hitBoxRadius, color });
//     this.image = new Image();
//     this.image.src =
//       "http://res.cloudinary.com/misclg/image/upload/v1512623984/PowerUpSprite_Snowflake.png";
//     this.dimensions = defaultPowerUpDimensions;
//     this.centerLineFraction=2;
//   }
//   activate() {
//     let currentTime = time;
//     while(time<= (currentTime+10)){
//       enemies.forEach(enemy => enemy.speed =0);
//       time++;
//     }
//   }
//   erase() {
//     let freezeIndex = freezeEnemies.indexOf(this);
//     freezeEnemies.splice(freezeIndex, 1);
//   }
//   draw() {
//     ctx.fillStyle = this.color;
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.hitBoxRadius, 0, Math.PI * 2);
//     ctx.strokeStyle = "sienna";
//     ctx.fill();
//     ctx.lineWidth = 2;
//     ctx.stroke();
//   }
// }

let freezeEnemies = [];

let mouse = { x: 0, y: 0 };
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

document.body.addEventListener("mousemove", updateMouse);

function clearBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(220,220,220, 0.8)";
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
      progressBar.value -= 10;
    }
  });
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i+1; j < enemies.length; j++) {
      enemies[i].pushOff(enemies[j]);
    }
    player.pushOff(enemies[i]);

  }
  const interact = function interactWithPlayer(object) {
    if (object.hasCollided(player)) {
      object.activate();
      object.deleteSelf();
    }
  };
  for (const powerUp in powerUps) {
    powerUps[powerUp].objects.forEach(interact);
  }

  // freezeEnemies.forEach(freezeEnemy1 => {
  //   if (freezeEnemy1.hasCollided(player)) {
  //     freezeEnemy1.activate();
  //     freezeEnemy1.erase();
  //   }
  // });
}
function endScene() {
  if (progressBar.value <= 0) {
    ctx.font = "30px Arial";
    ctx.fillText("Game over, click to play again", 0, canvas.height / 2);
  } else {
    requestAnimationFrame(drawScene);
  }
}
function drawScene() {
  clearBackground();
  enemies.forEach(enemy => enemy.draw());
  for (const powerUp in powerUps) {
    powerUps[powerUp].objects.forEach(object => object.draw());
  }
  // freezeEnemies.forEach(freezeEnemyI => freezeEnemyI.draw());
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

function createNewPowerUp(powerUpType) {
  const className = `${powerUpType.charAt(0).toUpperCase() +
    powerUpType.slice(1)}`;
  const constructorCall = Reflect.construct(eval(className), [
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    15,
    powerUps[powerUpType].hitBoxColor
  ]);
  if (progressBar.value > 0) {
    powerUps[powerUpType].objects.unshift(constructorCall);
  }
}
function spawnScoreFactor() {
  createNewPowerUp(`scoreFactor`);
}

function spawnEnemyEraser() {
  createNewPowerUp("enemyEraser");
}
function spawnHealth() {
  createNewPowerUp("health");
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

function restartGame() {
  if (progressBar.value === 0) {
    progressBar.value = 100;
    Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
    requestAnimationFrame(drawScene);
  }
}

const spawnEnemies = setInterval(spawnEnemy, 3000);
const spawnScoreFactors = setInterval(spawnScoreFactor, 5000);
const spawnEnemyErasers = setInterval(spawnEnemyEraser, 4000);
const spawnHealths = setInterval(spawnHealth, 4500);
// const spawnFreezes = setInterval(spawnFreeze, 5500);
const score = setInterval(IncreaseScore, 1000);
const addSeconds = setInterval(IncreaseTime,1000);

document.getElementById("button").addEventListener("click", startGame);
requestAnimationFrame(drawScene);
