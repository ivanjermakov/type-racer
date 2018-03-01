let textLeft;
let prevInput;
let isMistake = false;
let prevMistakeState = false;
let mistakeCount = 0;

let start;
let end;

function getText() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            let data = JSON.parse(request.responseText);
            let text = data.texts[Math.floor(Math.random() * data.texts.length)];

            if (text) {
                document.getElementById("text-to-input").innerText = text.text;
            } else {
                document.getElementById("text-to-input").innerText = "Something went wrong. Please, reload the page.";
            }
        }
    };
    request.open("GET", "src/rus.json", true);
    request.send();
}

function checkInput(input) {
    if (!input) {
        isMistake = false;
        document.body.style.backgroundColor = "#ffffff";
    }
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== textLeft[i]) {
            isMistake = true;
            document.body.style.backgroundColor = "#f8b6b2";
        }
    }
}

function checkWords(input) {
    if (!isMistake) {
        if (input === textLeft) {
            end = new Date();
            calculateStats();
            document.body.style.backgroundColor = "#c9f8cc";
            textLeft = "";
            document.forms["myForm"]["form"].disabled = true;
        }

        for (let i = 0; i < input.length - 1; i++) {
            if (input[i] !== textLeft[i]) {
                document.body.style.backgroundColor = "#f8b6b2";
                isMistake = true;
                return;
            }
        }

        textLeft = textLeft.substr(input.length);
        // console.log(textLeft);
        document.forms["myForm"]["form"].value = "";
    }
}

function controlErase(input) {
    if (isMistake) {
        for (let i = 0; i < input.length - 1; i++) {
            if (input[i] !== textLeft[i]) {
                //still an mistake
                return;
            }
        }
        document.body.style.backgroundColor = "#ffffff";
        isMistake = false;
    }
}

function confirmText() {
    let input = document.forms["myForm"]["form"].value;
    if (input === textLeft) {
        end = new Date();
        calculateStats();
        document.body.style.backgroundColor = "#c9f8cc";
        document.forms["myForm"]["form"].value = "";
        document.forms["myForm"]["form"].disabled = true;
    }

    return false;
}

function formInput() {
    //fix unprintable symbols
    let input = document.forms["myForm"]["form"].value;
    input.replace(/«/g, '"');
    input.replace(/»/g, '"');
    document.forms["myForm"]["form"].value = input;

    //init
    if (!textLeft) {
        textLeft = document.getElementById("text-to-input").innerText;
    }
    if (!prevInput && input) {
        prevInput = input;
    }

    //time count
    if (input.length === 1 && textLeft === document.getElementById("text-to-input").innerText) {
        start = new Date();
    }

    // logic
    checkInput(input);

    if (input && input[0] !== " ") {
        if (input[input.length - 1] === " ") {
            checkWords(input, textLeft);
        }
        if (prevInput.length - input.length === 1) {
            controlErase(prevInput, textLeft);
        }
        if (input === textLeft || !textLeft) {
            document.forms["myForm"]["form"].value = "";
        }
        if (input === textLeft || !textLeft) {
            end = new Date();
            calculateStats();
            document.body.style.backgroundColor = "#c9f8cc";
            document.forms["myForm"]["form"].value = "";
            document.forms["myForm"]["form"].disabled = true;
        }
    }

    if (prevMistakeState === false && isMistake === true) {
        mistakeCount++;
        document.getElementById("mistake-counter").textContent = "Mistakes: " + mistakeCount.toString();
    }

    prevMistakeState = isMistake;
    prevInput = input;
}

function calculateStats() {
    let timeElapsed = (end - start) / 60000;

    let initText = document.getElementById("text-to-input").innerText;
    let wordsCount = initText.split(' ').length;
    document.getElementById("wpm").innerText = "WPM: " + (wordsCount / timeElapsed).toFixed(0);
}

getText();