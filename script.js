let textLeft;
let prevInput;
let isError = false;

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
    if (!isError) {
        if (input === textLeft) {
            document.body.style.backgroundColor = "#c9f8cc";
            textLeft = "";
        }

        for (let i = 0; i < input.length - 1; i++) {
            if (input[i] !== textLeft[i]) {
                document.body.style.backgroundColor = "#f8b6b2";
                isError = true;
                return;
            }
        }

        textLeft = textLeft.substr(input.length);
        console.log(textLeft);
        document.forms["myForm"]["form"].value = "";
    }
}

function controlErase(input) {
    if (isError) {
        for (let i = 0; i < input.length - 1; i++) {
            if (input[i] !== textLeft[i]) {
                //still an error
                return;
            }
        }
        document.body.style.backgroundColor = "#ffffff";
        isError = false;
    }
}

function formInput() {
    //init
    let input = document.forms["myForm"]["form"].value;

    if (!textLeft) {
        textLeft = document.getElementById("text-to-input").innerText;
    }
    if (!prevInput && input) {
        prevInput = input;
    }

    //logic
    if (input && input[0] !== " ") {
        if (input[input.length - 1] === " ") {
            checkInput(input, textLeft);
        }
        if (prevInput.length - input.length === 1) {
            controlErase(input, textLeft);
        }
    }

    prevInput = input;
}

function confirmText() {
    let input = document.forms["myForm"]["form"].value;
    if (input === textLeft) {
        document.body.style.backgroundColor = "#c9f8cc";
    }
}

getText();