const canvas = document.getElementById("table");
const ctx = canvas.getContext("2d");

let paddle1Y = 150;
let paddle2Y = 150;
let paddleWidth = 10;
let paddleHeight = 60;

let ballX = 300;
let ballY = 200;
let ballSpeedX = 5;
let ballSpeedY = 2;

let userScore = 0;
let enemyScore = 0;
const maxScore = 5;

let celebrationPaused = false;

function drawPaddles() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.fillStyle = "red"; // Make the ball red
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawScores() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("You: " + userScore, 50, 30);
    ctx.fillText("Computer: " + enemyScore, canvas.width - 150, 30);
}

function drawWinnerScreen() {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    const winner = userScore === maxScore ? "You" : "Computer";
    ctx.fillText(`${winner} Wins!`, canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Press Spacebar to continue", canvas.width / 2 - 120, canvas.height / 2 + 50);
}

function movePaddles() {
    if (!celebrationPaused) {
        canvas.addEventListener("mousemove", function (event) {
            paddle1Y = event.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;

            if (paddle1Y < 0) {
                paddle1Y = 0;
            } else if (paddle1Y > canvas.height - paddleHeight) {
                paddle1Y = canvas.height - paddleHeight;
            }
        });
    }
}

function moveEnemyPaddle() {
    if (!celebrationPaused) {
        if (ballY > paddle2Y + paddleHeight / 2) {
            paddle2Y += 3;
        } else {
            paddle2Y -= 3;
        }

        if (paddle2Y < 0) {
            paddle2Y = 0;
        } else if (paddle2Y > canvas.height - paddleHeight) {
            paddle2Y = canvas.height - paddleHeight;
        }
    }
}

function moveBall() {
    if (!celebrationPaused) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY > canvas.height || ballY < 0) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }

        if (ballX > canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        }

        if (ballX < 0) {
            enemyScore++;
            resetBall();
        } else if (ballX > canvas.width) {
            userScore++;
            resetBall();
        }
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;

    if (userScore === maxScore || enemyScore === maxScore) {
        celebrationPaused = true;
        setTimeout(() => {
            celebrationPaused = false;
            userScore = 0;
            enemyScore = 0;
            updateCanvas();
        }, 3000); // Wait for 3 seconds before resetting
    }
}

function handleKeyPress(event) {
    if (event.code === "Space" && celebrationPaused) {
        celebrationPaused = false;
        updateCanvas();
    }
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddles();
    drawBall();
    drawScores();

    if (userScore === maxScore || enemyScore === maxScore) {
        drawWinnerScreen();
    } else {
        moveBall();
        moveEnemyPaddle();
        movePaddles();
    }

    requestAnimationFrame(updateCanvas);
}

updateCanvas();
movePaddles();
document.addEventListener("keydown", handleKeyPress);
