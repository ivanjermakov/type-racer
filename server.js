function getText() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            let data = JSON.parse(request.responseText);
            let text = data.texts[Math.floor(Math.random() * data.texts.length)];

            if (text) {
                text.text = text.text.replace(/«/g, '"');
                text.text = text.text.replace(/»/g, '"');
                document.getElementById("text").innerText = text.text;
            } else {
                document.getElementById("text").innerText = "Something went wrong. Please, reload the page.";
            }
        }
    };
    request.open("GET", "src/rus.json", true);
    request.send();
}