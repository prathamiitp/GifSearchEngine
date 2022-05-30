// grabbing the boxes from html file and reading the input
let input = document.querySelector(".js-userinput").value;
let outContainer = document.querySelector(".js-container");

// presenting the trending gifs on first entry
dataParse(
  "https://api.giphy.com/v1/gifs/trending?api_key=dhGatsWyo2dHB0vT8oyybsYlNGYfCQoD"
);

//readding the data from input field
function inputRead() {
  input = document.querySelector(".js-userinput").value;
  if (input == "") {
    return "https://api.giphy.com/v1/gifs/trending?api_key=dhGatsWyo2dHB0vT8oyybsYlNGYfCQoD";
  } else {
    return (
      "https://api.giphy.com/v1/gifs/search?q=" +
      input +
      "&api_key=dhGatsWyo2dHB0vT8oyybsYlNGYfCQoD"
    );
  }
}

// getting the data from remote url
function dataParse(url) {
  // AJAX(element reload, not the whole page) Request
  let GiphyAJAXCall = new XMLHttpRequest();
  GiphyAJAXCall.open("GET", url);
  GiphyAJAXCall.send();

  // parsing the data ionce it is loaded
  GiphyAJAXCall.addEventListener("load", function (gifdata) {
    let parsedData = JSON.parse(gifdata.target.response);
    output(parsedData.data);
  });
}

// showing the result
function output(gifUrls) {
  outContainer.innerHTML = "";
  // iterating through 25 gifs
  for (let i = 0; i < 25; i++) {
    // or use gifUrls.forEach(function(){}));
    // += operator same as in c or c++
    outContainer.innerHTML +=
      '<img src="' + gifUrls[i].images.fixed_height_downsampled.url + '">';
  }

  // the code here is to make a gif TV, just comment the uppar loop and run this insted
  // for (let i = 0; i < 25; i++) {
  //   setTimeout(function () {
  //     outContainer.innerHTML =
  //       '<img src="' + gifUrls[i].images.fixed_height_downsampled.url + '">';

  //     console.log(outContainer.innerHTML);
  //   }, 6000 * i);
  // }
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
