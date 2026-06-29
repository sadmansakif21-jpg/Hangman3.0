const words = [ "APPLE","TIGER","HOUSE","PLANE","LIGHT","MANGO","WATER","BOTTLE","SUGAR","PLATE","SPOON","SNAKE","PADMA","SOHA","MEHUU"
];
let targetWord = "";
let guessedWord = [];
let mistakes = 0;
const maxMistakes = 6;
let activePlayer = "";

const canvas = document.getElementById("hangman-canvas");
const ctx = canvas.getContext("2d");

// Start the game after character selection
function startGame(playerName) {
    activePlayer = playerName;
    document.getElementById("current-player").innerText = activePlayer;
    
    document.getElementById("selection-screen").classList.remove("active");
    document.getElementById("game-screen").classList.active = true;
    document.getElementById("game-screen").style.display = "block";
    document.getElementById("selection-screen").style.display = "none";

    resetGame();
}

// Initialize/Reset the game
function resetGame() {
    targetWord = words[Math.floor(Math.random() * words.length)];
    guessedWord = Array(targetWord.length).fill("_");
    mistakes = 0;

    document.getElementById("msg").innerText = "";
    document.getElementById("msg").className = "";
    document.getElementById("restart-btn").classList.add("hidden");

    updateWordDisplay();
    createKeyboard();
    clearCanvas();
}

// Display the blank lines or guessed letters
function updateWordDisplay() {
    document.getElementById("word-display").innerText = guessedWord.join(" ");
}

// Generate the onscreen keyboard
function createKeyboard() {
    const keyboardDiv = document.getElementById("keyboard");
    keyboardDiv.innerHTML = "";
    
    for (let i = 65; i <= 90; i++) {
        let letter = String.fromCharCode(i);
        let btn = document.createElement("button");
        btn.innerText = letter;
        btn.className = "key";
        btn.onclick = function() { handleGuess(letter, btn); };
        keyboardDiv.appendChild(btn);
    }
}

// Handle letter click
function handleGuess(letter, btn) {
    btn.disabled = true;

    if (targetWord.includes(letter)) {
        // Correct guess
        for (let i = 0; i < targetWord.length; i++) {
            if (targetWord[i] === letter) {
                guessedWord[i] = letter;
            }
        }
        updateWordDisplay();
        checkWin();
    } else {
        // Wrong guess
        mistakes++;
        drawStickman(mistakes);
        checkLoss();
    }
}

function checkWin() {
    if (!guessedWord.includes("_")) {
        document.getElementById("msg").innerText = "🎉 Congratulations " + activePlayer + "! You Won!";
        document.getElementById("msg").className = "win";
        disableAllKeys();
        document.getElementById("restart-btn").classList.remove("hidden");
    }
}

function checkLoss() {
    if (mistakes >= maxMistakes) {
        document.getElementById("msg").innerText = "💀 Game Over! The word was: " + targetWord;
        document.getElementById("msg").className = "lose";
        disableAllKeys();
        document.getElementById("restart-btn").classList.remove("hidden");
    }
}

function disableAllKeys() {
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => key.disabled = true);
}

// --- Canvas Drawing Logic for Stickman ---
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffffff";
}

function drawStickman(mistakeNum) {
    ctx.beginPath();
    
    // Check if player is female for custom drawing
    const isFemale = (activePlayer === "SOHU" || activePlayer === "MEHU");

    switch (mistakeNum) {
        case 1:
            // Base and pole (Same for both)
            ctx.moveTo(10, 230); ctx.lineTo(190, 230); // bottom base
            ctx.moveTo(50, 230); ctx.lineTo(50, 20);   // main pole
            ctx.moveTo(50, 20);  ctx.lineTo(130, 20);  // top pole
            ctx.moveTo(130, 20); ctx.lineTo(130, 50);  // rope
            break;
        case 2:
            // Head
            ctx.arc(130, 70, 20, 0, Math.PI * 2);
            if (isFemale) {
                // Add ponytail for female characters
                ctx.moveTo(150, 70);
                ctx.quadraticCurveTo(170, 75, 160, 95);
            }
            break;
        case 3:
            // Body
            if (isFemale) {
                // Draw a dress (triangle shape)
                ctx.moveTo(130, 90);  // Top/Neck
                ctx.lineTo(110, 160); // Bottom left
                ctx.lineTo(150, 160); // Bottom right
                ctx.lineTo(130, 90);  // Close triangle
            } else {
                // Normal male body
                ctx.moveTo(130, 90); ctx.lineTo(130, 160);
            }
            break;
        case 4:
            // Left Arm
            ctx.moveTo(130, 110); ctx.lineTo(100, 140);
            break;
        case 5:
            // Right Arm
            ctx.moveTo(130, 110); ctx.lineTo(160, 140);
            break;
        case 6:
            // Left & Right Leg (Game Over)
            if (isFemale) {
                // Legs slightly adjusted under the dress
                ctx.moveTo(120, 160); ctx.lineTo(110, 200); // left leg
                ctx.moveTo(140, 160); ctx.lineTo(150, 200); // right leg
            } else {
                // Normal legs
                ctx.moveTo(130, 160); ctx.lineTo(100, 200); // left leg
                ctx.moveTo(130, 160); ctx.lineTo(160, 200); // right leg
            }
            break;
    }
    ctx.stroke();
}
