"use strict";

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function makeBoard(width, height) {
  var blankSymbol = "_";
  var board = [];
  
  board.content = [];
  board.state = [];
  for(var i=0;i<height;i++){
    board.content[i] = [];
    board.state[i] = [];
    for(var j=0; j<width; j++) {
      board.content[i][j] = blankSymbol;
      board.state[i][j] = blankSymbol
    }
  }
  
  return board;
}

function printBoard(board) {
  board = board.content;
  var height = board.length;
  var width = board[0].length;
  
  var text = "";
  for(var i=0;i<height;i++){
    text += "|";
    for(var j=0;j<width;j++){
      text += board[i][j];
      text += "|";
    }
    text += "</br>";
  }	
  return text;
}

function prettyPrintBoard(board) {		
  var height = board.content.length;
  var width = board.content[0].length;
  var cellClass = "";
  var cellId = "";
  var cellContent = "";
  var onClick = "";
  
  var text = "";
  for(var i=0;i<height;i++) {
    text += "<div class='row'>";
    for(var j=0;j<width;j++) {
      if(board.state[i][j] === "_") {
        cellClass = "square blank";
        cellId = i+","+j;
        cellContent = "_";
        onClick = "revealSubmit("+i+","+j+")";
      } else {
        cellClass = "square open"+board.content[i][j];
        cellClass += board.state[i][j] === "hit" ? " hit" : "";
        cellId = i+","+j;
        cellContent = board.content[i][j];
        onClick = "";
      }
      text += "<div class = '"+cellClass+"' id='"+cellId+"' onClick='"+onClick+"'>"+cellContent+"</div>";
    }
    text += "</div>";
  }	
  return text;
}

function plantMines(board,numMines) {
  var height = board.length;
  var width = board[0].length;
  
  var min = 0;
  
  var mineSymbol = "B";
  
  while(numMines>0){
    var row = getRandomInt(min, height-1);
    var col = getRandomInt(min, width-1);
    
    if(board[row][col] === "_"){
      board[row][col] = mineSymbol;
      numMines--;
    }
  }
  
  return board;
}

function printNumbers(board) {
  var height = board.length;
  var width = board[0].length;
  var numBombs = 0;
  
  for(var i=0;i<height;i++) {				
    for(var j=0;j<width;j++) {
      numBombs = 0;
      if(board[i][j] === "_") {
        for(var x=-1;x<=1;x++) {
          if( i+x >= 0 && i+x < height) { //check if edge
            for(var y=-1;y<=1;y++) {
              if( j+y >= 0 && j+y < width) { // check if edge
                if(board[i+x][j+y] === "B") {
                  numBombs++;
                }
              }
            }
          }
        }
        if(numBombs > 0){
          board[i][j] = numBombs;
        }
      }
    }
  }			
  
  return board;
}

function revealBombs(){
  var height = window.gameBoard.content.length;
  var width = window.gameBoard.content[0].length;

  for(var i=0; i<height; i++) {
    for(var j=0; j<width; j++) {
      if(window.gameBoard.content[i][j] === "B") {
        window.gameBoard.state[i][j] = "O";
      }
    }
  }
}

function reveal(row,col){
  var height = window.gameBoard.content.length;
  var width = window.gameBoard.content[0].length;
  
  if(window.gameBoard.state[row][col] === "_") {
    window.gameBoard.state[row][col] = "O";
    
    if(window.gameBoard.content[row][col] === "_"){      
      for(var x=-1;x<=1;x++) {
        if( row+x >= 0 && row+x < height) { //check if edge
          for(var y=-1;y<=1;y++) {
            if( col+y >= 0 && col+y < width) { // check if edge
              reveal(row+x, col+y);
            }
          }
        }
      }
    } else if(window.gameBoard.content[row][col] === "B"){
      revealBombs();
      window.gameBoard.state[row][col] = "hit";
      window.alert("Kapow!\n You hit a bomb, you lose.");
      window.gameOn = false;
    }
  }
  return;
}

function revealSubmit(row,col){
  //var row = Number(document.getElementById("row").value);
  //var col = Number(document.getElementById("column").value);
  if(window.gameOn){
    reveal(row,col);
    var printText = prettyPrintBoard(gameBoard);
    document.getElementById("board").innerHTML=printText;
    window.gameBoard = gameBoard;
  }
}

function printIt(){
  var gameBoard;
  gameBoard = makeBoard(20,10);
  gameBoard.content = plantMines(gameBoard.content,20);
  gameBoard.content = printNumbers(gameBoard.content);
  var printText = prettyPrintBoard(gameBoard);
  document.getElementById("board").innerHTML=printText;
  window.gameBoard = gameBoard;
  window.gameOn = true;
};

window.onload=function(){
  var gameBoard;
  gameBoard = makeBoard(20,10);
  gameBoard.content = plantMines(gameBoard.content,20);
  gameBoard.content = printNumbers(gameBoard.content);
  var printText = prettyPrintBoard(gameBoard);
  document.getElementById("board").innerHTML=printText;
  window.gameBoard = gameBoard;
  window.gameOn = true;
}
