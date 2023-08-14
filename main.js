const scoreEl = document.getElementById("scoreEl");
const scoreLvl = document.getElementById("scoreLvl");

const death = new Audio("./sounds/pacman_death.wav");
const move = new Audio("./sounds/pacman_chomp.wav");
const up = new Audio("./sounds/pacman_eatghost.wav");
const kill = new Audio("./sounds/pacman_intermission.wav");

const next = new Audio("./sounds/pacman_ringtone.mp3");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = 520;
canvas.height = 600;

let animationId;
let lvl = 1;
let lastKey = "";
let score = 0;
let pellets = [];
let boundaries = [];
let powerUps = [];
let ghosts = [];
let player;

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
const lvl0 = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", "x", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

const lvl1 = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", "p", ".", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
  ["|", ".", "b", ".", "[", "7", "-", "7", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", "_", ".", ".", ".", ".", "|"],
  ["|", "g", "[", "]", ".", ".", ".", ".", ".", "[", "]", "g", "|"],
  ["|", ".", ".", ".", ".", "^", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "+", "-", "+", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "5", "-", "5", "]", ".", "b", ".", "|"],
  ["|", "p", ".", ".", ".", "x", ".", ".", ".", ".", ".", "p", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

const lvl2 = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "1", "]", ".", "^", ".", "^", ".", "[", "2", ".", "|"],
  ["|", ".", "_", ".", ".", "6", "-", "8", ".", ".", "_", ".", "|"],
  ["|", "g", ".", ".", "[", "3", ".", "4", "]", ".", "p", "g", "|"],
  ["|", ".", "^", ".", ".", ".", ".", ".", ".", ".", "^", ".", "|"],
  ["|", ".", "|", ".", "1", "2", ".", "1", "2", ".", "|", ".", "|"],
  ["|", ".", "|", ".", "4", "3", ".", "4", "3", ".", "|", ".", "|"],
  ["|", ".", "_", ".", ".", ".", ".", ".", ".", ".", "_", ".", "|"],
  ["|", ".", "p", ".", "[", "2", ".", "1", "]", ".", ".", ".", "|"],
  ["|", ".", "^", ".", ".", "6", "-", "8", ".", ".", "^", ".", "|"],
  ["|", ".", "4", "]", ".", "_", ".", "_", ".", "[", "3", ".", "|"],
  ["|", ".", ".", ".", ".", ".", "x", ".", ".", ".", ".", ".", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

const lvl3 = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "1", "]", ".", "^", ".", "^", ".", "[", "2", ".", "|"],
  ["|", ".", "|", "p", ".", "6", "7", "8", ".", "p", "|", ".", "|"],
  ["|", "g", "4", "]", ".", "4", "5", "3", ".", "[", "3", "g", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "-", "7", "-", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", ".", "|", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "-", "5", "-", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "^", ".", "[", "2", ".", "1", "]", ".", "^", ".", "|"],
  ["|", "g", "|", ".", ".", "|", ".", "|", ".", ".", "|", "g", "|"],
  ["|", ".", "4", "]", ".", "_", ".", "_", ".", "[", "3", ".", "|"],
  ["|", ".", ".", ".", ".", ".", "x", ".", ".", ".", ".", ".", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

const createImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};

const creatLvl = (lvl) => {
  lvl.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case "-":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage("./img/pipeHorizontal.png"),
            })
          );
          break;
        case "|":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage("./img/pipeVertical.png"),
            })
          );
          break;
        case "1":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage("./img/pipeCorner1.png"),
            })
          );
          break;
        case "2":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage("./img/pipeCorner2.png"),
            })
          );
          break;
        case "3":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage("./img/pipeCorner3.png"),
            })
          );
          break;
        case "4":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage("./img/pipeCorner4.png"),
            })
          );
          break;
        case "b":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i,
              },
              image: createImage("./img/block.png"),
            })
          );
          break;
        case "[":
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage("./img/capLeft.png"),
            })
          );
          break;
        case "]":
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage("./img/capRight.png"),
            })
          );
          break;
        case "_":
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage("./img/capBottom.png"),
            })
          );
          break;
        case "^":
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage("./img/capTop.png"),
            })
          );
          break;
        case "+":
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage("./img/pipeCross.png"),
            })
          );
          break;
        case "5":
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              color: "blue",
              image: createImage("./img/pipeConnectorTop.png"),
            })
          );
          break;
        case "6":
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              color: "blue",
              image: createImage("./img/pipeConnectorRight.png"),
            })
          );
          break;
        case "7":
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              color: "blue",
              image: createImage("./img/pipeConnectorBottom.png"),
            })
          );
          break;
        case "8":
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage("./img/pipeConnectorLeft.png"),
            })
          );
          break;
        case ".":
          pellets.push(
            new Pellet({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2,
              },
            })
          );
          break;
        case "p":
          powerUps.push(
            new PowerUp({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2,
              },
            })
          );
          break;
        case "x":
          player = new Pacman({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2,
            },
            velocity: {
              x: 0,
              y: 0,
            },
          });
          break;
        case "g":
          ghosts.push(
            new Ghost({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2,
              },
              velocity: {
                x: 0,
                y: -Ghost.speed,
              },
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            })
          );
          break;
      }
    });
  });
};

const circleCollisionWithRectangled = ({ circle, rectangled }) => {
  const padding = Boundary.width / 2 - circle.radius - 1;
  return (
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangled.position.y + rectangled.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangled.position.x - padding &&
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangled.position.y - padding &&
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangled.position.x + rectangled.width + padding
  );
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollisionWithRectangled({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangled: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -5;
      }
    }
  } else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollisionWithRectangled({
          circle: {
            ...player,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangled: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -5;
      }
    }
  } else if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollisionWithRectangled({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangled: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 5;
      }
    }
  } else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollisionWithRectangled({
          circle: {
            ...player,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangled: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 5;
      }
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw();
    if (
      circleCollisionWithRectangled({ circle: player, rectangled: boundary })
    ) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  });

  //power up
  for (let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i];
    powerUp.draw();

    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      up.play();
      powerUps.splice(i, 1);
      score += 10;
      scoreEl.innerText = score;

      ghosts.forEach((ghost) => {
        ghost.scared = true;

        setTimeout(() => {
          ghost.scared = false;
        }, 5000);
      });
    }
  }

  // kropki
  for (let i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i];
    pellet.draw();

    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      pellets.splice(i, 1);
      score += 10;
      scoreEl.innerText = score;
    }
  }

  // detect collision between ghosts  and player
  for (let i = ghosts.length - 1; 0 <= i; i--) {
    const ghost = ghosts[i];

    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        kill.play();
        setTimeout(() => {
          ghosts.push(ghost);
        }, 5000);

        ghosts.splice(i, 1);
        score += 50;
        scoreEl.innerText = score;
      } else {
        cancelAnimationFrame(animationId);
        death.play();
        context.fillStyle = "#000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#fff";
        context.font = "30px sans-serif";
        context.fillText("You Loss", canvas.width / 2.5, canvas.height / 2);
        setTimeout(() => {
          location.reload(true);
        }, 5000);
      }
    }
  }

  player.update();

  //ghost coollisions and move
  ghosts.forEach((ghost) => {
    ghost.update();
    const coollisions = [];
    boundaries.forEach((boundary) => {
      if (
        !coollisions.includes("right") &&
        circleCollisionWithRectangled({
          circle: {
            ...ghost,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangled: boundary,
        })
      ) {
        coollisions.push("right");
      }

      if (
        !coollisions.includes("left") &&
        circleCollisionWithRectangled({
          circle: {
            ...ghost,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangled: boundary,
        })
      ) {
        coollisions.push("left");
      }

      if (
        !coollisions.includes("top") &&
        circleCollisionWithRectangled({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangled: boundary,
        })
      ) {
        coollisions.push("top");
      }

      if (
        !coollisions.includes("dawn") &&
        circleCollisionWithRectangled({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangled: boundary,
        })
      ) {
        coollisions.push("dawn");
      }
    });
    if (coollisions.length > ghost.prevCollisions.length)
      ghost.prevCollisions = coollisions;

    if (JSON.stringify(coollisions) !== JSON.stringify(ghost.prevCollisions)) {
      if (ghost.velocity.x > 0) ghost.prevCollisions.push("right");
      else if (ghost.velocity.x < 0) ghost.prevCollisions.push("left");
      else if (ghost.velocity.y < 0) ghost.prevCollisions.push("top");
      else if (ghost.velocity.y > 0) ghost.prevCollisions.push("dawn");

      const pathways = ghost.prevCollisions.filter((coollision) => {
        return !coollisions.includes(coollision);
      });

      const direction = pathways[Math.floor(Math.random() * pathways.length)];

      switch (direction) {
        case "dawn":
          ghost.velocity.x = 0;
          ghost.velocity.y = ghost.speed;
          break;
        case "top":
          ghost.velocity.x = 0;
          ghost.velocity.y = -ghost.speed;
          break;
        case "left":
          ghost.velocity.x = -ghost.speed;
          ghost.velocity.y = 0;
          break;
        case "right":
          ghost.velocity.x = ghost.speed;
          ghost.velocity.y = 0;
          break;
      }
      ghost.prevCollisions = [];
    }
  });
  //player rotation
  if (player.velocity.x > 0) player.rotation = 0;
  else if (player.velocity.x < 0) player.rotation = Math.PI;
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;

  // win
  if (pellets.length === 0) {
    cancelAnimationFrame(animationId);
    lvl += 1;
    scoreLvl.innerText = lvl;
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.font = "30px sans-serif";
    lvl > 3
      ? context.fillText(`You Win`, canvas.width / 2.5, canvas.height / 2)
      : context.fillText(
          `Next LvL ${lvl}`,
          canvas.width / 2.5,
          canvas.height / 2
        );
    next.play();
    setTimeout(() => {
      lastKey = "";
      pellets = [];
      boundaries = [];
      powerUps = [];
      ghosts = [];
      player = 0;
      switch (lvl) {
        case 2:
          creatLvl(lvl2);
          animate();
          break;
        case 3:
          creatLvl(lvl3);
          animate();
          break;
      }
    }, 3000);
  }
};

window.addEventListener("keydown", ({ key }) => {
  move.loop = true;
  move.play();
  switch (key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";

      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});
window.addEventListener("keyup", ({ key }) => {
  move.loop = false;
  switch (key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

creatLvl(lvl1);
animate();
