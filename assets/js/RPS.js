
var chatMessage = "";
var addMessage = ""




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

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("p1").html("There are " + snap.numChildren() + " players");
    // if(snap.numChildren()>2){
    //     alert("Game has reached to player limit, sorry you can't join this time.")
    // }
});




//regular two players game

var player1Click = "Scissors";
var player2Click = "Rock";
var player1 = "";
var player2 = "";
var player1Name = "";
var player2Name = "";



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
    console.log("player1: " + player1);
    console.log("player2: " + player2);
}

gameResult(player1Click, player2Click);


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

// creating player 1
$("#player1").on("click", function () {
    event.preventDefault();
    player1Name = $("#player1Input").val().trim();
    database.ref("/player1").push({
        name: player1Name,
    })
    $("#player1Name").append(": " + player1Name);

})

// creating player 2
$("#player2").on("click", function () {
    event.preventDefault();
    player2Name = $("#player2Input").val().trim();
    database.ref("/player2").push({
        name: player2Name,
    })
    $("#player2Name").append(": " + player2Name);

})

// when player1 plays
$("#rock1").on("click", function () {

    player1Click = "Rock";
    database.ref("/player1").push({
        player1Click: player1Click,
    })
    $("#paper1").hide();
    $("#scissors1").hide();

})

$("#paper1").on("click", function () {

    player1Click = "Paper";
    database.ref("/player1").push({
        player1Click: player1Click,
    })
    $("#rock1").hide();
    $("#scissors1").hide();

})

$("#scissors1").on("click", function () {

    player1Click = "Scissors";
    database.ref("/player1").push({
        player1Click: player1Click,
    })
    $("#paper1").hide();
    $("#rock1").hide();

})