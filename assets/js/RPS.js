//regular two players game

var player1Click = "Scissors";
var player2Click = "Rock";
var player1 = "";
var player2 = "";


// regular RPS rules
function gameResult(player1Click, player2Click) {
    if ((player1Click === "Rock" && player2Click === "Scissors")
        || (player1Click === "Paper" && player2Click === "Rock")
        || (player1Click === "Scissors" && player2Click === "Paper")) {
        player1 = "win";
        player2 = "lost";
    }
    else if ((player1Click === "Rock" && player2Click === "Rock")
        || (player1Click === "Paper" && player2Click === "Paper")
        || (player1Click === "Scissors" && player2Click === "Scissors")) {
        player1 = "tie";
        player2 = "tie";
    }
    else {
        player1 = "lost";
        player2 = "win";
    }
  console.log("player1: "+player1);
  console.log("player2: "+player2);
}

gameResult(player1Click,player2Click);
