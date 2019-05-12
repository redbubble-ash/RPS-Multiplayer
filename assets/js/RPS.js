
var chatMessage = "";
var addMessage = "";
var player1Click = "";
var player2Click = "";
var player1 = "";
var player2 = "";
var player1Name = "";
var player2Name = "";
var playerNumber = 0;
var player1Result = "";
var player2Result = "";
var result1 = "";
var result2 = "";
var player1Img = "";
var player2Img = "";
var myName = "";
var checkPlayAgain1 = "";
var checkPlayAgain2 = "";





var firebaseConfig = {
    apiKey: "AIzaSyAFXZ20ElXP90YlsRYcZ9OcDD10p8Gdi1A",
    authDomain: "rps-multiplayer-game-e1e01.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-game-e1e01.firebaseio.com",
    projectId: "rps-multiplayer-game-e1e01",
    storageBucket: "rps-multiplayer-game-e1e01.appspot.com",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database.
var database = firebase.database();

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {

        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();

    }
});

// When loaded/connected, get the number of the connection 
// the first reviewer/player should be the first connection, player#1: snap.numChildren() === 1
connectionsRef.once("value", function (snap) {

    playerNumber = snap.numChildren();
    if (playerNumber === 1) {
        $("p2").html("You are player number 1");
        $("#player2").hide();
        $("#option1").hide();
        $("#option2").hide();
        $("#p2").hide();
        $("#playAgain").hide();


    }
    else if (playerNumber === 2) {
        $("p2").html("You are player number 2");
        $("#player1").hide();
        $("#option1").hide();
        $("#option2").hide();
        $("#p1").hide();
        $("#playAgain").hide();
    }
    else {
        alert("Game has reached to player limit, sorry you can't join this time.")//when player number greater than two
        $(".mainPage").hide();
    }

});
// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("p1").html("There are " + snap.numChildren() + " players");
    // in case of one of the players left game, if player2 stays, this will reassign player2 to player1
    if (snap.numChildren() === 1) {
        playerNumber = 1;
        $("p2").html("You are player number 1");
        // this checks if this player has played more than once or if this player stays, if so, variable:"myName" should be true. 
        if (myName) {
            $("#player1Name").html("Player 1: " + myName);
            $("#option1").show();
            $("#rock1").show();
            $("#paper1").show();
            $("#scissors1").show();
            database.ref("/player1").update({
                name: myName,
                playerClick: "",
                checkPlayAgain: "",
            })
            database.ref("/player2").remove();
            $("#image1").attr("src", "assets/images/scissors.png", alt = "scissors");
            $("#image2").attr("src", "assets/images/scissors.png", alt = "scissors");
            $("#player2").hide();
            $("#option2").hide();
            $("#p2").hide();
            $("#player2Name").html("Player 2: ");
            $("#playAgain").hide();
            $("#result").empty();
            // reset variable player1 & player2 to empty string.
            player1 = "";
            player2 = "";
        }

    }
});




// regular RPS rules
function gameResult(player1Click, player2Click) {
    if ((player1Click === "Rock" && player2Click === "Scissors")
        || (player1Click === "Paper" && player2Click === "Rock")
        || (player1Click === "Scissors" && player2Click === "Paper")) {
        player1Result = "win";
        player2Result = "lost";
    }
    else if ((player1Click === "Rock" && player2Click === "Rock")
        || (player1Click === "Paper" && player2Click === "Paper")
        || (player1Click === "Scissors" && player2Click === "Scissors")) {
        player1Result = "tie";
        player2Result = "tie";
    }
    else {
        player1Result = "lost";
        player2Result = "win";
    }
    console.log("player1: " + player1Result);
    console.log("player2: " + player2Result);
    $("#playAgain").show();
    $("#result").html("player1: " + player1Result + "<br>" + "player2: " + player2Result);

}

$("#playAgain").on("click", function () {
    resetGame();

    //store checkPlayAgain object to firebase when playagin button is clicked
    if (playerNumber === 1) {
        database.ref("/player1").update({
            checkPlayAgain: true,
        })
        player1 = "";

    }
    else if (playerNumber === 2) {
        database.ref("/player2").update({
            checkPlayAgain: true,
        })
        player2 = "";

    }

})


//checking if player clicked play again button, only reset game when both players click the play again button
database.ref("/player1/checkPlayAgain").on("value", function (snap) {
    checkPlayAgain1 = snap.val();
    if (checkPlayAgain1 && checkPlayAgain2) {
        if (playerNumber === 1) {
            $("#option1").show();
            $("#rock1").show();
            $("#paper1").show();
            $("#scissors1").show();
        }
        else if (playerNumber === 2) {
            $("#option2").show();
            $("#rock2").show();
            $("#paper2").show();
            $("#scissors2").show();
        }
    }
})

//checking if player clicked play again button, only reset game when both players click the play again button
database.ref("/player2/checkPlayAgain").on("value", function (snap) {
    checkPlayAgain2 = snap.val();
    if (checkPlayAgain1 && checkPlayAgain2) {
        if (playerNumber === 1) {
            $("#option1").show();
            $("#rock1").show();
            $("#paper1").show();
            $("#scissors1").show();
        }
        else if (playerNumber === 2) {
            $("#option2").show();
            $("#rock2").show();
            $("#paper2").show();
            $("#scissors2").show();
        }
    }
})






//  initialize player 1, when the player1 enter the name
$("#player1").on("click", function () {
    event.preventDefault();
    player1Name = $("#player1Input").val().trim();
    database.ref("/player1").set({
        name: player1Name,
        playerClick: "",
        checkPlayAgain: "",
    })
    database.ref("/player1").onDisconnect().remove();//remove player1 on firebase when disconnected
    $("#player1Name").append(": " + player1Name);
    $("#player1Input").val("");//empty input box
    myName = player1Name;
    $("#option1").show();
    $("#rock1").show();
    $("#paper1").show();
    $("#scissors1").show();
    // console.log("my name is " + myName);


})

// initialize player 2, when the player2 enter the name
$("#player2").on("click", function () {
    event.preventDefault();
    player2Name = $("#player2Input").val().trim();
    database.ref("/player2").set({
        name: player2Name,
        playerClick: "",
        checkPlayAgain: "",
    })
    database.ref("/player2").onDisconnect().remove();//remove player2 on firebase when disconnected
    $("#player2Name").append(": " + player2Name);
    $("#player2Input").val("");//empty input box
    myName = player2Name;
    $("#option2").show();
    $("#rock2").show();
    $("#paper2").show();
    $("#scissors2").show();
    // console.log("my name is " + myName);


})

// when player1 plays
$("#rock1").on("click", function () {

    player1Click = "Rock";
    $("#image1").attr("src", "assets/images/rock.png", alt = "rock");
    database.ref("/player1").set({
        name: player1Name,
        playerClick: player1Click,
    })
    $("#paper1").hide();
    $("#scissors1").hide();
    database.ref("/player1").onDisconnect().remove();//remove player1 on firebase when disconnected

})

$("#paper1").on("click", function () {

    player1Click = "Paper";
    $("#image1").attr("src", "assets/images/paper.png", alt = "paper");
    database.ref("/player1").set({
        name: player1Name,
        playerClick: player1Click,
    })
    $("#rock1").hide();
    $("#scissors1").hide();
    database.ref("/player1").onDisconnect().remove();//remove player1 on firebase when disconnected
})

$("#scissors1").on("click", function () {

    player1Click = "Scissors";
    $("#image1").attr("src", "assets/images/scissors.png", alt = "scissors");
    database.ref("/player1").set({
        name: player1Name,
        playerClick: player1Click,
    })
    $("#paper1").hide();
    $("#rock1").hide();
    database.ref("/player1").onDisconnect().remove();//remove player1 on firebase when disconnected

})

// when player2 plays
$("#rock2").on("click", function () {

    player2Click = "Rock";
    $("#image2").attr("src", "assets/images/rock.png", alt = "rock");
    database.ref("/player2").set({
        name: player2Name,
        playerClick: player2Click,
    })
    $("#paper2").hide();
    $("#scissors2").hide();
    database.ref("/player2").onDisconnect().remove();//remove player2 on firebase when disconnected

})

$("#paper2").on("click", function () {

    player2Click = "Paper";
    $("#image2").attr("src", "assets/images/paper.png", alt = "paper");
    database.ref("/player2").set({
        name: player2Name,
        playerClick: player2Click,
    })
    $("#rock2").hide();
    $("#scissors2").hide();
    database.ref("/player2").onDisconnect().remove();//remove player2 on firebase when disconnected

})

$("#scissors2").on("click", function () {

    player2Click = "Scissors";
    $("#image2").attr("src", "assets/images/scissors.png", alt = "scissors");
    database.ref("/player2").set({
        name: player2Name,
        playerClick: player2Click,
    })
    $("#paper2").hide();
    $("#rock2").hide();
    database.ref("/player2").onDisconnect().remove();//remove player2 on firebase when disconnected

})

// show resulet, get playclick value for player1 and assign to varibale player1 (client side)
database.ref("/player1").on("value", function (snap) {
    if (snap.val() === null) {
        return;
    }// handle the case if the snap val() is null
    else {
        player1 = snap.val().playerClick;
        if (player1 && player2) {
            gameResult(player1, player2);
            player1Img = player1.toLowerCase();
            player2Img = player2.toLowerCase();
            $("#image1").attr("src", "assets/images/" + player1Img + ".png", alt = player1);
            $("#image2").attr("src", "assets/images/" + player2Img + ".png", alt = player2);
            database.ref("/player1").update({
                checkPlayAgain1: ""
            })
        }
        else{
            return;
        }
    }
})

//show result, get playclick value for player2 and assign to varibale player2 (client side)

database.ref("/player2").on("value", function (snap) {
    if (snap.val() === null) {
        return;
    }//handle the case if the snap val() is null
    else {
        player2 = snap.val().playerClick;
        if (player1 && player2) {
            gameResult(player1, player2);
            player1Img = player1.toLowerCase();
            player2Img = player2.toLowerCase();
            $("#image1").attr("src", "assets/images/" + player1Img + ".png", alt = player1);
            $("#image2").attr("src", "assets/images/" + player2Img + ".png", alt = player2);
            database.ref("/player2").update({
                checkPlayAgain2: ""
            })
        }
        else{
            return;
        }
    }
})



// live chatting function

// creating child and push message info to newMessage on the server
$("#message").on("click", function () {
    event.preventDefault();
    // console.log("check");
    chatMessage = $("#leaveMessage").val().trim();

    database.ref("/newMessage").push({
        message: chatMessage,
    });


})

// getting new message info from server and display on chat box.
// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref("/newMessage").orderByChild("dateAdded").limitToLast(1).on("child_added", function (childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().message);

    // creating new <p> message line in the chat box
    addMessage = $("<p>").html(childSnapshot.val().message);
    $(".chat").prepend(addMessage);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});




function resetGame() {
    if (playerNumber === 1) {
        $("p2").html("You are player number 1");
        $("#player2").hide();
        $("#option2").hide();
        $("#option1").hide();
        $("#p2").hide();
        $("#image1").attr("src", "assets/images/scissors.png", alt = "scissors");
        $("#image2").attr("src", "assets/images/scissors.png", alt = "scissors");
        $("#result").html("Wating for the other player to finish ...... ");
        $("#playAgain").hide();
        database.ref("/player1").set({
            name: myName,
            playerClick: ""
        })
        database.ref("/player2").update({
            playerClick: ""
        })

    }
    else if (playerNumber === 2) {
        $("p2").html("You are player number 2");
        $("#player1").hide();
        $("#option1").hide();
        $("#option2").hide();
        $("#p1").hide();
        $("#image1").attr("src", "assets/images/scissors.png", alt = "scissors");
        $("#image2").attr("src", "assets/images/scissors.png", alt = "scissors");
        $("#result").html("Wating for the other player to finish ...... ");
        $("#playAgain").hide();
        database.ref("/player2").set({
            name: myName,
            playerClick: ""
        })
        database.ref("/player1").update({
            playerClick: ""
        })

    }
    else {
        alert("Game has reached to player limit, sorry you can't join this time.")//when player number greater than two
        $(".mainPage").hide();

    }

}



