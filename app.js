//Initializing variables

var origBoard;
var huPlayer= 'O';
var aiPlayer = 'X';
var winCombos= [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
var winSound = new Audio("./assets/result.mp3")
var drawSound = new Audio("./assets/draw.wav")
var clickSound = new Audio("./assets/click.wav")
var loseSound = new Audio("./assets/lose.mp3")

var gameEnded = false;

const cells = document.querySelectorAll(".cell")
//Setting Score
if (localStorage.getItem("huscore")==null) {
    localStorage.setItem("huscore",0)
    localStorage.setItem("aiscore",0)
}

var huscore = Number(localStorage.getItem("huscore"))
var aiscore = Number(localStorage.getItem("aiscore"))

var huscoredisplay = document.getElementById("xsc");
var aiscoredisplay = document.getElementById("ysc");


huscoredisplay.innerHTML = huscore;
aiscoredisplay.innerHTML = aiscore;
startGame()

//Start Game 
function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys())
    console.log(origBoard);
    for (var i =0; i< cells.length; i++){
        cells[i].innerText = "";
        cells[i].style.removeProperty("background-color");
        cells[i].addEventListener('click', turnClick,false )
}
}

//check if cell clicked
function turnClick(square) {
    if (typeof origBoard[square.target.id] === 'number') {
    
        turn(square.target.id,huPlayer);
        if (!checkTie("") ) {
            let score= 0;
         for (let i = 0; i < origBoard.length; i++) {
            if (typeof origBoard[i] !== 'number') {
                score +=1;
            }
         }
         if (score !== 9) {
            turn(bestSpot(),aiPlayer)    
         }else{
            checkTie("drawFound");
         }
        
       }
    }
    clickSound.play();

}


//set the text
function turn(squareId,player) {
    origBoard[squareId]= player;
   
        cells[squareId].innerText = player;
        
  
    let gameWon = checkWin(origBoard,player);
    if (gameWon) {
        gameOver(gameWon);
    }
}


//check if player won
function checkWin(origBoard,player) {
    let plays=origBoard.reduce((a,e,i) => (e===player) ? a.concat(i) : a,[]) ;

    let gameWon = null;
   
    for(let[index,win] of winCombos.entries()){
        if (win.every(elem=> plays.indexOf(elem)>-1)) {
            gameWon = {index: index, player: player};
            gameEnded = true;
            break;
        }
    }

    return gameWon;
}


//GameOver Function

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player === huPlayer ? "blue" : "red"
    }
   gameWon.player === huPlayer ? winSound.play() : loseSound.play();
   gameWon.player === huPlayer ? declareWinner("You Win!") : declareWinner("You Lose!");
   if (gameWon.player === huPlayer) {
    huscore += 1;
    localStorage.setItem("huscore",huscore);
    localStorage.setItem("aiscore",aiscore);
    huscoredisplay.innerHTML = huscore;
    aiscoredisplay.innerHTML = aiscore;
   }else if (gameWon.player === aiPlayer) {
    
    aiscore += 1;
    localStorage.setItem("huscore",huscore);
    localStorage.setItem("aiscore",aiscore);
    huscoredisplay.innerHTML = huscore;
    aiscoredisplay.innerHTML = aiscore;
   }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click',turnClick,false);
        
    }
}

//declare the winner

function declareWinner(who) {
    document.querySelector('.endgame').style.display = "block"
    document.querySelector('.endgame .text').innerHTML= who
}
//checking the empty squares 


function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

//find the best spot for AI

function bestSpot() {
    return minimax(origBoard,aiPlayer).index;
}

function checkTie(para){
    
    if((emptySquares().length ===0 && gameEnded === false )|| para === "drawFound" && gameEnded === false){
        drawSound.play();
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click',turnClick,false);
        }
        declareWinner("Tie Game!");
      
        return true;
    }else{
        return false;
    }
}

//Minimax

function minimax(newBoard, player){
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard,player)) {
        return {score: -10};
        
    }else if(checkWin(newBoard,aiPlayer)){
        return {score: 20};

    }else if(availSpots.length === 0){
        return {score: 0};
    }

    var moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard,huPlayer);
            move.score= result.score;
        }else{
            var result = minimax(newBoard,aiPlayer);
            move.score= result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);

    }


    var bestMove;

    if (player === aiPlayer) {
        var bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
           if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
           }
        }
    }else{
        var bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
           if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
           }
        }
    }

    return moves[bestMove];
}

//restart the game

function restart() {
    localStorage.setItem("huscore",0)
    localStorage.setItem("aiscore",0)
    location.reload();
}
