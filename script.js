const GAME_BOARD_ID= "game-board";
const INSTRUCTION_TEXT_ID = "instruction-text";
const LOGO_ID = "logo";
const DIV_HTML_ELEMENT = "div";
const SNAKE_CLASS = "snake";
const FOOD_CLASS = "food";
const GRID_SIZE = 20;
const LEFT = "left";
const UP = "up";
const DOWN = "down";
const RIGHT = "right"; //Default direction.
const SCORE_ID="score";
const HIGH_SCORE="highScore"
//HTML Elements.
const board = document.getElementById(GAME_BOARD_ID);
const instructionText = document.getElementById(INSTRUCTION_TEXT_ID);
const logo = document.getElementById(LOGO_ID);
const score = document.getElementById(SCORE_ID);
const highScoreElement = document.getElementById(HIGH_SCORE);

//Game Variables.
let snake=[{x:10, y:10}]; // X, Y position on board where snake starts.
let food = generateFood();
let direction = RIGHT;
let highScore = 0;
let gameInterval;
let gameSpeedDelay = 200;
let isGameStarted = false;

//Draw game map, snake and food.
function draw(){
    board.innerHTML=''; //Everytime we draw, we reset the board.
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement = createGameElement(DIV_HTML_ELEMENT, SNAKE_CLASS);
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

function drawFood(){
    if(isGameStarted){
        const foodElement=createGameElement(DIV_HTML_ELEMENT, FOOD_CLASS);
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }
    
}

function generateFood(){
    const x = Math.floor(Math.random() * GRID_SIZE) + 1;
    const y = Math.floor(Math.random() * GRID_SIZE) + 1;
    return {x,y};
}

function createGameElement(tag, className){  //Create a snake or food cube/div.
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position){ //set position of snake or food across the board.
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}

//moving snake
function move(){
    const head = {...snake[0]};
    switch(direction){
        case UP:
            head.y--;
            break;
        case DOWN:
            head.y++;
            break;
        case LEFT:
            head.x--;
            break;
        case RIGHT:
            head.x++;
            break;
    }

    snake.unshift(head);
    
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //Clear past Interval
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }else{
        snake.pop();
    }
}

function startGame(){
    isGameStarted = true;
    instructionText.style.display='none';
    logo.style.display='none';
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//key press event listener
function handleKeyPress(event){
    if((!isGameStarted && event.code==='Space') || (!isGameStarted && event.key===' ')){
        startGame();
    }else{
        switch (event.key) {
            case 'ArrowUp':
                direction = UP;
                break;
            case 'ArrowDown':
                direction = DOWN;
                break;
            case 'ArrowLeft':
                direction = LEFT;
                break;
            case 'ArrowRight':
                direction = RIGHT;
                break;
        }
    }
}

function increaseSpeed(){
    if(gameSpeedDelay>150){
        gameSpeedDelay-=5;
    }else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }else if(gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
}

function checkCollision(){
    const head=snake[0];
    if(head.x<1 || head.x> GRID_SIZE || head.y<1 || head.y> GRID_SIZE){
        resetGame();
    }

    for (let index = 1; index < snake.length; index++) {
        if(head.x === snake[index].x && head.y === snake[index].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = RIGHT;
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length-1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

function updateHighScore(){
    const currentScore = snake.length-1;

    if(currentScore>highScore){
        highScore=currentScore;
        highScoreElement.textContent=highScore.toString().padStart(3, '0');
    }
    highScoreElement.style.display = 'block';
}

function stopGame(){
    clearInterval(gameInterval);
    isGameStarted=false;
    instructionText.style.display='block';
    logo.style.display='block';
}

document.addEventListener('keydown', handleKeyPress);
