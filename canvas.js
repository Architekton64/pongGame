const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const drawCircle = function(x, y, r) { // simplify circle drawing
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
};

const random = function() {
	return Math.floor(Math.random() * 4) + 7; // 5 - 9
};

const gameData = {
	ball: {
		x: canvas.width / 2,
		y: canvas.height / 2,
		xd: random(),
		yd: 1,
		r: 23
	},
	pad1: {
		x: 10,
		y: canvas.height / 2 - 50,
		w: 15,
		h: 64,
		yd: 18
	},
	pad2: {
		x: canvas.width - 25,
		y: canvas.height / 2 - 50,
		w: 15,
		h: 64,
		yd: 18
	},
	player1: {
		score: 0,
	},
	player2: {
		score: 0,
	}
};

const ball = gameData.ball; // simplifying stuff
const pad1 = gameData.pad1;
const pad2 = gameData.pad2;
const player1 = gameData.player1;
const player2 = gameData.player2;

const reverseDirection = function() {
	if ((player1.score + player2.score) % 2) {
		ball.xd = -ball.xd;
		ball.yd = -ball.yd;
	}
};

const boardReset = function() { // fixes the ball to center
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.xd = 0;
	ball.yd = 0;
};

const randomizeDirection = function() {
	ball.xd = random() + 2;
	ball.yd = 10 - ball.xd;
	reverseDirection();
};

const ballIsOut = function() { // separate cases for scoring
	if (ball.x <= 0) {
		boardReset();
		player2.score++;
		setTimeout(randomizeDirection, 750); // delay execution
		return true;
	} else if (ball.x >= canvas.width) {
		boardReset();
		player1.score++;
		setTimeout(randomizeDirection, 750);
		return true;
	} else {
		return false; // for debugging purposes ballIsOut() === true;
	}
};

const gameOver = function() {
	if (player1.score === 6) {
		location.reload();
		alert("Player 1 won!");
	} else if (player2.score === 6) {
		location.reload();
		alert("Player 2 won!");
	}
};

const upKey1 = 38;   // up
const downKey1 = 40; // down
const upKey2 = 87;   // w
const downKey2 = 83; // s

// target                   type        listener
document.addEventListener('keydown', function(event) {
	if (event.keyCode === downKey1) {
		pad2.y += pad2.yd;                         // player 1 controls (left side)
	} else if (event.keyCode === upKey1) {
		pad2.y -= pad2.yd;
	} else if (event.keyCode === downKey2) {       // player 2 controls (right side)
		pad1.y += pad1.yd;
	} else if (event.keyCode === upKey2) {
		pad1.y -= pad1.yd;
	}
}, false);
//  useCapture

let collisionNum = 0;

const collision = function() {
	if (ball.y + ball.r / 2 >= pad1.y && ball.y - ball.r / 2 <= pad1.y + pad1.h && ball.x - ball.r <= pad1.x + pad1.w) { // bounce off pad1
		ball.xd = -ball.xd;                                        // divide 2 for appearance 
		ball.yd = random() - 3; // correct speed
		collisionNum++;
		if (collisionNum % 2) {ball.yd = - ball.yd;}
	} else if (ball.y + ball.r / 2 >= pad2.y && ball.y - ball.r / 2 <= pad2.y + pad2.h && ball.x + ball.r >= pad2.x + pad2.w /2) { // bounce off pad2
		ball.xd = -ball.xd;                                        // divide 2 for appearance
		ball.yd = random() - 3;
 	} else if (ball.y >= canvas.height - ball.r || ball.y <= ball.r) { // bounce off the upper and lower walls
		ball.yd = -ball.yd;
	}
};

const draw = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect(pad1.x, pad1.y, pad1.w, pad1.h); // pad1
	ctx.fillRect(pad2.x, pad2.y, pad2.w, pad2.h); // pad2
	ctx.fillStyle = "white";
	drawCircle(ball.x, ball.y, ball.r);           // ball
	ctx.font = "100px Monospace";
	ctx.textAlign = "center";
	ctx.fillText(player1.score + " : " + player2.score, canvas.width/2, canvas.height/2);
};

const update = function() {
	ball.x += ball.xd;
	ball.y += ball.yd;

	collision();	
	ballIsOut();
	gameOver();
};

const loop = function() {
	draw();
	update();
	requestAnimationFrame(loop);
};

loop();