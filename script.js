let textLeft;
let textDone;

let prevInput;
let isMistake = false;
let prevMistakeState = false;
let mistakeCount = 0;

let start;
let end;

let formStyle;

function checkInput(input) {
    if (!input) {
        isMistake = false;
        formStyle.border = "2px solid #686868";
    }

    for (let i = 0; i < input.length; i++) {
        if (input[i] !== textLeft[i]) {
            isMistake = true;
            // document.body.style.backgroundColor = "#f8b6b2";
            formStyle.border = "2px solid #f8b6b2";
        }
    }

    if (input && input[0] !== " ") {
        if (input[input.length - 1] === " ") {
            checkWords(input, textLeft);
        }
        if (prevInput.length - input.length === 1) {
            controlErase(prevInput, textLeft);
        }
        if (input === textLeft + " " || !textLeft) {
            end = new Date();
            calculateStats();

            textLeft = "";
            textDone = document.getElementById("text").innerText;
            textIsTyped();
        }
    }
}

function updateTextToInput() {
    let textToInput = document.getElementById("text");
    if (textDone) {
        textToInput.innerHTML = "<span id='correct'>" + textDone + " " + "</span>" + textLeft;
    }
}

function checkWords(input) {
    if (!isMistake) {
        for (let i = 0; i < input.length - 1; i++) {
            if (input[i] !== textLeft[i]) {
                // document.body.style.backgroundColor = "#f8b6b2";
                formStyle.border = "2px solid #f8b6b2";
                isMistake = true;
                return;
            }
        }

        if (input === textLeft) {
            end = new Date();
            calculateStats();
            formStyle.border = "2px solid #c9f8cc";
            textLeft = "";
            document.forms["myForm"]["form"].disabled = true;

            let textToInput = document.getElementById("text");
            textToInput.innerHTML = "";
            document.getElementById("correct").innerText = textToInput.innerText;
        }

        textLeft = textLeft.substr(input.length);
        document.forms["myForm"]["form"].value = "";

        textDone = document.getElementById("text").innerText;
        textDone = textDone.slice(0, -(textLeft.length + 1));
    }
}

function controlErase(input) {
    if (isMistake) {
        for (let i = 0; i < input.length - 1; i++) {
            if (input[i] !== textLeft[i]) {
                //still a mistake
                return;
            }
        }
        formStyle.border = "2px solid #686868";
        isMistake = false;
    }
}

function confirmText() {
    let input = document.forms["myForm"]["form"].value;
    if (input === textLeft) {
        textIsTyped();
    }

    return false;
}

function formInput() {
    formStyle = document.getElementById("type-input").style;

    //init
    let input = document.forms["myForm"]["form"].value;
    if (!textLeft) {
        textLeft = document.getElementById("text").innerText;
    }
    if (!prevInput && input) {
        prevInput = input;
    }

    //time count
    if (input.length === 1 && textLeft === document.getElementById("text").innerText) {
        start = new Date();
    }

    // logic
    checkInput(input);

    //count mistakes
    if (prevMistakeState === false && isMistake === true) {
        mistakeCount++;
        document.getElementById("mistake-counter").textContent = "Mistakes: " + mistakeCount.toString();
    }

    updateTextToInput();

    //lifetime
    prevMistakeState = isMistake;
    prevInput = input;
}

function textIsTyped() {
    end = new Date();
    calculateStats();
    formStyle.border = "2px solid #c9f8cc";
    document.forms["myForm"]["form"].value = "";
    document.forms["myForm"]["form"].disabled = true;

    let textToInput = document.getElementById("text");
    textToInput.innerHTML = "<span id='correct'>" + textToInput.innerText + "</span>";
}

function calculateStats() {
    let timeElapsed = (end - start) / 60000;

    let initText = document.getElementById("text").innerText;
    let wordsCount = initText.split(' ').length;
    document.getElementById("wpm").innerText = "WPM: " + (wordsCount / timeElapsed).toFixed(0);
}

getText();