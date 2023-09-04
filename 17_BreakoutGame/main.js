document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const navButtons = document.querySelectorAll(".navBtn");
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  });

  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");

  const brickInfo = {
    w: 70,
    h: 20,
    x: 45,
    y: 60,
    p: 10,
    v: true,
  };
  const bricks = [];
  const initBricks = function () {
    for (let i = 0; i < 5; ++i) {
      bricks[i] = [];
      for (let j = 0; j < 9; ++j) {
        bricks[i][j] = { ...brickInfo };
        bricks[i][j].x += (brickInfo.w + brickInfo.p) * j;
        bricks[i][j].y += (brickInfo.h + brickInfo.p) * i;
      }
    }
  };
  const drawBricks = function () {
    bricks.forEach((bricksRows) => {
      bricksRows.forEach((brick) => {
        if (!brick.v) return;

        ctx.beginPath();
        ctx.fillStyle = "#0195dd";
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fill();
      });
    });
  };

  const paddle = {};
  const initPaddle = function () {
    paddle.w = 100;
    paddle.h = 10;
    paddle.x = canvas.width / 2 - 50;
    paddle.y = canvas.height - 30;
    paddle.velocity = 0;
    paddle.speed = 8;
  };
  const drawPaddle = function () {
    ctx.beginPath();
    ctx.fillStyle = "#01ddb8";
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fill();
  };
  const movePaddle = function () {
    paddle.x += paddle.velocity;
    if (paddle.x <= 0) paddle.x = 0;
    if (paddle.x + paddle.w >= canvas.width) paddle.x = canvas.width - paddle.w;
  };

  const ball = {};
  const initBall = function () {
    ball.x = canvas.width / 2;
    const signX = Math.random() > 0.5 ? 1 : -1;
    ball.x += signX * Math.random() * 50;

    ball.y = canvas.height / 2;
    const signY = Math.random() > 0.5 ? 1 : -1;

    ball.y += signY * Math.random() * 50;

    ball.r = 10;
    ball.dx = signX;
    ball.dy = -1;
    ball.speed = 5;
  };
  const drawBall = function () {
    ctx.beginPath();
    ctx.fillStyle = "#0126dd";
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  };
  const moveBall = function () {
    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;

    const ballTop = ball.y - ball.r;
    const ballBottom = ball.y + ball.r;
    const ballLeft = ball.x - ball.r;
    const ballRight = ball.x + ball.r;

    if (ballLeft <= 0 || ballRight >= canvas.width) ball.dx *= -1;
    if (ballTop <= 0) ball.dy *= -1;
    if (ballBottom >= canvas.height) {
      init();
      score = 0;
      return;
    }

    if (
      ballBottom >= paddle.y &&
      paddle.x <= ball.x &&
      ball.x <= paddle.x + paddle.w
    )
      ball.dy = -1;

    bricks.forEach((bricksRows) => {
      bricksRows.forEach((brick) => {
        if (!brick.v) return;
        const brickTop = brick.y;
        const brickBottom = brick.y + brick.h;
        const brickLeft = brick.x;
        const brickRight = brick.x + brick.w;

        if (brickLeft <= ball.x && ball.x <= brickRight) {
          if (
            (brickTop <= ballTop && ballTop <= brickBottom) ||
            (brickTop <= ballBottom && ballBottom <= brickBottom)
          ) {
            ball.dy *= -1;
            brick.v = false;
            score++;
          }
        } else if (brickTop <= ball.y && ball.y <= brickBottom) {
          if (
            (brickLeft <= ballRight && ballRight <= brickRight) ||
            (brickLeft <= ballLeft && ballLeft <= brickRight)
          ) {
            ball.dx *= -1;
            brick.v = false;
            score++;
          }
        }
      });
    });
  };

  let score = 0;
  const drawScore = function () {
    ctx.fillStyle = "#0195dd";
    ctx.font = "2rem roboto serif";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, 400, 40);
  };

  let raf = null;
  let isPaused = false;
  const loop = function () {
    movePaddle();
    moveBall();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    drawScore();

    raf = window.requestAnimationFrame(loop);
  };

  const init = function () {
    initBricks();
    initPaddle();
    initBall();
    score = 0;
  };

  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") paddle.velocity = -paddle.speed;
    if (e.code === "ArrowRight") paddle.velocity = paddle.speed;
  });
  document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") paddle.velocity = 0;
  });

  const toggleBtn = document.querySelector("#toggleBtn");
  toggleBtn.addEventListener("click", () => {
    if (isPaused) {
      raf = window.requestAnimationFrame(loop);
      isPaused = false;
      toggleBtn.textContent = "Pause";
    } else {
      window.cancelAnimationFrame(raf);
      isPaused = true;
      toggleBtn.textContent = "Play";
    }
  });

  init();
  loop();
});
