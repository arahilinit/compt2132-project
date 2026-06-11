/* Abtin Rahili Nejad */
// cntrl f5 for refresh

const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const numberOfAllowedGuesses = 5;
const output = document.getElementById("output");
const hintElement = document.getElementById("hint");
const guessesElement = document.getElementById("guesses");
const hangmanImageElement = document.getElementById("hangman-img");
const popupElement = document.getElementById("game-popup");
const popupTitleElement = document.getElementById("popup-title");
const popupMessageElement = document.getElementById("popup-message");
const popupImageElement = document.getElementById("popup-image");
const playAgainBtn = document.getElementById("play-again-button");
const winningImageNumber = 6;
const losingImageNumber = 5;
const jsonFilePath = '../data/words.json';

let wordList = [];
let secretWord = "";
let hint = "";
let guessedLetters = [];
let numberOfIncorrectGuesses = 0;
let animationProgress = 0;
let popupAnimation;


class SecretWord 
{
    #value;
    #hint;

    constructor(value, hint) 
    {
        this.#value = value;
        this.#hint = hint;
    }

    get getValue() {
        return this.#value;
    }

    get getHint() {
        return this.#hint;
    }
}


function animatePopup() {
   
    animationProgress += 0.01; 

    popupElement.style.opacity = animationProgress;

    if (animationProgress < 1) 
    {
        popupAnimation = requestAnimationFrame(animatePopup);
    } 
    else 
    {
        cancelAnimationFrame(popupAnimation);
    }
}
function showWinPopup () {
    
    popupTitleElement.innerHTML = "You Win!";
    popupMessageElement.innerHTML = `The word was "${secretWord}".`;
    popupTitleElement.style.color = "green";

    
    popupImageElement.src = `../images/image${winningImageNumber}.png`
    popupElement.style.opacity = 0;
    popupElement.style.display = "block";
    animationProgress = 0;
    animatePopup();
}

function showLosePopup () {
    
    popupTitleElement.innerHTML = "Game Over";
    popupMessageElement.innerHTML = `The word was "${secretWord}".`;
    popupTitleElement.style.color = "red";

    popupImageElement.src = `../images/image${losingImageNumber}.png`
    popupElement.style.opacity = 0;
    popupElement.style.display = "block";

    animationProgress = 0;
    animatePopup();
}



playAgainBtn.addEventListener("click", function() {
    popupElement.style.display = "none";

    numberOfIncorrectGuesses = 0;

    
    const newJsonObject = wordList[Math.floor(Math.random() * wordList.length)];
    secretWord = newJsonObject.getValue;
    hint = newJsonObject.getHint;

    guessedLetters = [];
    for (let i = 0; i < secretWord.length; i++) {
        guessedLetters.push("_");
    }


    createKeyboard();

    

    output.innerHTML = guessedLetters.join(" ");
    hintElement.innerHTML = `Hint: ${hint}`;
    guessesElement.innerHTML = `Incorrect Guesses: ${numberOfIncorrectGuesses}/${numberOfAllowedGuesses}`;
    

    hangmanImageElement.src = `../images/image${numberOfIncorrectGuesses}.png`;



    
});

function createKeyboard() 
{
    let html = "";

    for (let i = 0; i < letters.length; i++) 
    {    
        html += `<div class="button" id="${letters[i]}">
                    ${letters[i]}
                </div>`;
    }

    keyboard.innerHTML = html;

    const buttons = document.querySelectorAll(".button");

    for (let i = 0; i < buttons.length; i++)
    {
        const btn = buttons[i];

        btn.style.cursor = "pointer";

        btn.addEventListener("click", function () {
            if (!btn.classList.contains("pressedButton")) 
            {
                const pressedLetter = btn.id;
                let letterFound = false;

                btn.disabled = true;
                btn.classList.add("pressedButton");                

                for (let i = 0; i < secretWord.length; i++) 
                {
                    if (secretWord[i] === pressedLetter) 
                    {
                        guessedLetters[i] = pressedLetter;
                        letterFound = true;
                    }
                }
                
                output.innerHTML = guessedLetters.join(" ");
                
                if (!letterFound)
                {
                    numberOfIncorrectGuesses++;
                    guessesElement.innerHTML = `Incorrect Guesses: ${numberOfIncorrectGuesses}/${numberOfAllowedGuesses}`;
                    hangmanImageElement.src = `../images/image${numberOfIncorrectGuesses}.png`;
                }
                

               
                let includesUnderscore = false;

                for (let i = 0; i < guessedLetters.length; i++) {
                    if (guessedLetters[i] === "_") {
                        includesUnderscore = true;
                        break;
                    }
                }

                if (!includesUnderscore) {
                    showWinPopup();
                }

                else if (numberOfIncorrectGuesses >= numberOfAllowedGuesses) {
                    showLosePopup();
                }
                else
                {
                    //nothing to do
                }
             
                

            }
        });
    }
}

function init() 
{
    fetch(jsonFilePath).then(function (response) 
    {
        if (response.ok) 
        {
            return response.json();
        }else
        {
            console.log("Network error: fetch failed!");
        }
    }).then(function (data) 
    {
            
        for (let i = 0; i < data.length; i++) 
        {
            const item = data[i];
            wordList.push(new SecretWord(item.value, item.hint));
        }

        const newJsonObject = wordList[Math.floor(Math.random() * wordList.length)];
        //console.log("wordList:", wordList);
        secretWord = newJsonObject.getValue;
        hint = newJsonObject.getHint;

        for (let i = 0; i < secretWord.length; i++) 
        {
            guessedLetters.push("_");
        }

        createKeyboard();
        output.innerHTML = guessedLetters.join(" ");
        hintElement.innerHTML = "Hint: " + hint;
        guessesElement.innerHTML = "Incorrect Guesses: " + numberOfIncorrectGuesses + "/" + numberOfAllowedGuesses;
    })
    .catch(function (error) 
    {
        console.error("Catch fetch error" + error);
    });
}








init();
