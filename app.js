if ('speechSynthesis' in window) {
    console.log('Speech Synthesis is supported in this browser');
} else {
    console.log('Speech Synthesis is not supported in this browser');
}

const instructions = document.querySelector('#instructions');
const startButton = document.querySelector('#start');
const quitButton = document.querySelector('#quit');
const maxButtons = document.querySelectorAll('.max-button');
const optionsRow = document.querySelector('#options-row');
const trainerContainer = document.querySelector('#trainer-container');
const numbersContainer = document.querySelector('#numbers-container');
const scoreContainer = document.querySelector('#score-container');
const numSpan = document.querySelector('#num-span');
const progressRow = document.querySelector('#progress-row');
const passButton = document.querySelector('#pass');
const failButton = document.querySelector('#fail');
const againButton = document.querySelector('#again');
const revealButton = document.querySelector('#reveal');

let gameState = false;
let attempts = 0;
let score = 0;
let max = 100;
let scoreText = '';

const randNum = (max) => {
    return Math.floor(Math.random() * max) + 1;
}

const initialize = () => {
    startButton.disabled = true;
    quitButton.disabled = false;
    startButton.classList.toggle('deactivated');
    quitButton.classList.toggle('deactivated');
    trainerContainer.classList.toggle('deactivated');
    scoreContainer.classList.toggle('deactivated');
    optionsRow.classList.toggle('deactivated');
    let gameState = true;
    instructions.innerText = 'Adjust the maximum to increase or decrease difficulty. When you are finished, press quit to exit the game and see your score.';
}

const reset = () => {
    startButton.innerText = 'Try Again';
    startButton.disabled = false;
    quitButton.disabled = true;
    startButton.classList.toggle('deactivated');
    quitButton.classList.toggle('deactivated');
    trainerContainer.classList.toggle('deactivated');
    optionsRow.classList.toggle('deactivated');
    instructions.innerText = 'To give it another go, press the button below.';
    let gameState = false;
    score = 0;
    attempts = 0;
}

maxButtons.forEach(t => t.addEventListener('click', (e) => {
    if (!e.target.disabled) {
        maxButtons.forEach(b => {
            b.classList.remove('selected-max');
            b.disabled = false;
        });
        e.target.disabled = true;
        e.target.classList.add('selected-max');
        max = e.target.innerText;
    }
}))

const numGen = (n) => {
    passButton.disabled = true;
    failButton.disabled = true;
    numSpan.classList.toggle('fade-in');
    numSpan.innerHTML = '';
    n.text = randNum(max);
    window.speechSynthesis.speak(n);
}

var msg = new SpeechSynthesisUtterance();
msg.text = randNum(max);
msg.lang = 'fr';

msg.addEventListener('end', (event) => {
    console.log(`Utterance has finished being spoken after ${event.elapsedTime} seconds.`);
    setTimeout(function () {
        numSpan.innerHTML = msg.text;
        numSpan.classList.toggle('fade-in');
        passButton.disabled = false;
        failButton.disabled = false;
    }, 1000);

});

startButton.addEventListener('click', async () => {
    initialize();
    numGen(msg);
})

passButton.addEventListener('click', () => {
    score += 1;
    attempts += 1;
    console.log(`${score} out of ${attempts} correct`);
    numGen(msg);
});

failButton.addEventListener('click', () => {
    attempts += 1;
    console.log(`${score} out of ${attempts} correct`);
    numGen(msg);
});

const scoreCalc = () => {
    let scorePercent = 0;
    if (score > 0) {
        scorePercent = Math.ceil((score / attempts) * 100);
    }
    if (scorePercent > 75) {
        scoreText = `${scorePercent}%<br>Bravo!<br>You got ${score} out of ${attempts} correct!`
    } else {
        scoreText = `${scorePercent}%<br>Trop dommage...<br>You got ${score} out of ${attempts} correct.`
    }
    scoreContainer.innerHTML = scoreText;
}

quitButton.addEventListener('click', () => {
    scoreCalc();
    scoreContainer.classList.toggle('deactivated');
    reset();
});