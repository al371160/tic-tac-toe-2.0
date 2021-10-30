    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
    import { collection, query, getDocs, orderBy, getFirestore, addDoc, serverTimestamp, onSnapshot, deleteDoc, doc} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyAMPnGMXz0CerC2XDCDhxzOHPM9row0PvY",
    authDomain: "another-project-f7b77.firebaseapp.com",
    projectId: "another-project-f7b77",
    storageBucket: "another-project-f7b77.appspot.com",
    messagingSenderId: "549504757495",
    appId: "1:549504757495:web:5474ff574a390769026df2",
    measurementId: "G-J9PRMPSFEW"

};

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore();

    const q = query(collection(db, "tictactoe"), orderBy("timestamp"));
    const querySnapshot = await getDocs(q);

    let board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];

    let currentPlayer = "X"
    const unsubscribeFunction = onSnapshot(q, (querySnapshot) => {

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                board[doc.data().row][doc.data().col] = doc.data().player;

                let winnerExist = checkForWinner();
                if (winnerExist) {
                    $("#winner").html(doc.data().player + " has won!");
                }

                if (doc.data().player === "X") {
                    currentPlayer = "O";
                } else {
                    currentPlayer = "X";
                }
            });

            drawBoard();
    });

function drawBoard() {
    for (let row = 0; row < board.length; row ++) {
        const rowArray = board[row]
        for (let col = 0; col < rowArray.length; col ++) {
            $(`button[data-row='${row}'][data-col='${col}']`).html(rowArray[col])
        }
    }
}


function checkForWinner() {
    let winningString = currentPlayer + currentPlayer + currentPlayer;
    //check all rows
    for (let row = 0; row < board.length; row++) {
        const rowArray = board[row]
        if (rowArray.join("") === winningString) {
            return true;
        }
    }
    for (let col = 0; col < board.length; col++) {

        if (board[0][col] === currentPlayer &&
            board[1][col] === currentPlayer &&
            board[2][col] === currentPlayer) {
            return true;
        }
    }
    //diagonals
    if (board[0][0] === currentPlayer &&
        board[1][1] === currentPlayer &&
        board[2][2] === currentPlayer) {
        return true;
    }

    if (board[0][2] === currentPlayer &&
        board[1][1] === currentPlayer &&
        board[2][0] === currentPlayer) {
        return true;
    }
}

drawBoard();

$(".square").click(async (event) => {
    const buttonThatWasClicked = event.target;
    const row = parseInt($(buttonThatWasClicked).attr("data-row"));
    const col = parseInt($(buttonThatWasClicked).attr("data-col"));

    if (board[row][col] !== " ") {
        return;
    }

    console.log(`Row: ${row}, Col: ${col} `)
    board[row][col] = currentPlayer;

    drawBoard();


    setTimeout(function () {
        let winnerExist = checkForWinner();
        if (winnerExist) {
            $("#winner").html(currentPlayer + " wins!!!");
        }
    }, 10)

    const docRef = await addDoc(collection(db, "tictactoe"), {
        row: row,
        col: col,
        player: currentPlayer,
        timestamp: serverTimestamp()
    });

    if (currentPlayer == "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }
})

$("#reset-btn").click(async () => {

    unsubscribeFunction();

    board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];

    const querySnapshot = await getDocs(collection(db, "tictactoe"));
    let deletePromises = [];
    querySnapshot.forEach(async (currentDoc) => {
       deletePromises.push(deleteDoc(doc (db, "tictactoe", currentDoc.id)));
    });

    await Promise.all(deletePromises);

    //drawBoard();
    window.location.href = window.location.href;

});