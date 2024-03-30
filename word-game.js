const letters = document.querySelectorAll(".box")
ANSWER_LENGTH = 5;
ROUNDS = 6;
let done = false;
async function init(){
    let currentGuess = "";
    let currentRow = 0;

    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    console.log(word);
    const wordParts = word.split("");
    
    function addLetter (letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0, ANSWER_LENGTH - 1) + letter;
        }
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    async function commit() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            // do nothing
            return;
        }

        // TODO validate the word

        // TODO do all the marking "correct" "close" or"wrong"
        guessParts = currentGuess.split("");
        let map = letterMap(wordParts);

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            //mark as correct
            if (guessParts[i] === wordParts[i]) {
                letters[ANSWER_LENGTH*currentRow + i].classList.add("correct");
                map[guessParts[i]] --;
            }
        }

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]){
                //do nothing
            } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                letters[ANSWER_LENGTH*currentRow + i].classList.add("close");
                map[guessParts[i]] --;
            } else {
                letters[ANSWER_LENGTH*currentRow + i].classList.add("wrong");
            }
        }

        currentRow ++;

        if (currentGuess === word) {
            alert ("You win!");
            document.querySelector(".brand").classList.add("winner")
            done = true;
            return;
        } else if (currentRow === ROUNDS) {
            alert(`You lost. The correct word is ${word}`);
            done = true;
        }

        currentGuess = "";
    }

    function backspace() {
        if (currentGuess.length === 0) {
            // do nothing
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length-1);
            letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
        }
    }

    document.addEventListener("keydown", function handleKeyPress (event) {
        if (done) {
            // do nothing
            return;
        }
        const action = event.key;
        console.log(action);
        if (action === "Enter") {
            commit();
        } else if (action === "Backspace") {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase())
        } else {
            //do nothing
        }
    });
}


function isLetter (letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function letterMap (array) {
    let obj = {};
    for (let i = 0; i < array.length; i++) {
        if (obj[array[i]]) {
            obj[array[i]] ++;
        } else {
            obj[array[i]] = 1;
        }
    }
    return obj;
}

init();