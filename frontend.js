// grabbing the boxes from html file and reading the input
let input = document.querySelector(".js-userinput").value;
let outContainer = document.querySelector(".js-container");

const serverUrl = "http://localhost:8080/gif?q=";

// presenting the trending gifs on first entry
dataParse("trending");

//readding the data from input field
function inputRead() {
  input = document.querySelector(".js-userinput").value;
  if (input == "") {
    return "trending";
  } else {
    return input;
  }
}

// getting the data from remote url
function dataParse(url) {
  // AJAX(element reload, not the whole page) Request
  let GiphyAJAXCall = new XMLHttpRequest();
  GiphyAJAXCall.open("GET", serverUrl + url);
  GiphyAJAXCall.send();

  // parsing the data once it is loaded
  GiphyAJAXCall.addEventListener("load", (gifdata) => {
    let parsedData = JSON.parse(gifdata.target.response);
    output(parsedData.data);
    console.log(parsedData.data);
  });
}

// showing the result
function output(gifUrls) {
  outContainer.innerHTML = "";
  // iterating through all gifs that are returned
  gifUrls.forEach((i) => {
    outContainer.innerHTML += '<img src="' + i.url + '">';
  });
}

// "click" event listner over button icon, to read the data
document.querySelector(".js-go").addEventListener("click", function () {
  // using the url, input and key, getting the data for gifs
  dataParse(inputRead());
});

// "enter key press" event listener, to read input data
document
  .querySelector(".js-userinput")
  .addEventListener("keyup", function (keyEvent) {
    if (keyEvent.key == "Enter") {
      dataParse(inputRead());
    }
  });

// tv.giphy.com/v1/gifs/tv?api_key=CW27AW0nlp5u0&tag=giphytv
