"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var https = require("https");
var GifUrl = require("./model/url");
require("dotenv/config");
// https://api.giphy.com/v1/gifs/search?q=requestQuery&api_key=dhGatsWyo2dHB0vT8oyybsYlNGYfCQoD
var giphyUrl = "https://api.giphy.com/v1/gifs/search?q=";
var giphyApiKey = "&api_key=dhGatsWyo2dHB0vT8oyybsYlNGYfCQoD";
// try to fetch data from db, if doesnt exist then fetch from giphy api
function fetchFromDb(requestQuery, res) {
    console.log("fetching from db");
    GifUrl.findAll({
        where: {
            name: requestQuery,
        },
    }).then(function (result) {
        if (result.length == 0) {
            console.log("len=0");
            fetchFromGiphy(requestQuery, res);
        }
        else {
            console.log("response generated");
            res.end(JSON.stringify({ data: result }));
        }
    });
}
// add the data to the database
function addToDb(values, res) {
    console.log("adding to db");
    GifUrl.bulkCreate(values).then(function (result) {
        console.log("response generated");
        res.end(JSON.stringify({ data: result }));
    });
}
// fetch data from giphy api
function fetchFromGiphy(requestQuery, res) {
    console.log("fetching from giphy");
    // making http get request to giphy api
    https
        .get(giphyUrl + requestQuery + giphyApiKey, function (resp) {
        console.log("Recieving response...");
        var responseData = "";
        var finalUrls = [];
        // A chunk of data has been received.
        resp.on("data", function (chunk) {
            responseData += chunk;
        });
        console.log("response recieved");
        // The whole response has been received. Print out the result.
        resp.on("end", function () {
            //get the data of gifs only, remove the pagenation and other response
            var responseDataJson = JSON.parse(responseData).data;
            //get the final urls in an array
            responseDataJson.forEach(function (i) {
                finalUrls.push({
                    name: requestQuery,
                    url: i.images.fixed_height_downsampled.url,
                });
            });
            // if the response was empty then return empty array else add to db and fetch from db
            if (finalUrls.length == 0) {
                console.log("empty response generated");
                res.end(JSON.stringify([]));
                return;
            }
            else {
                addToDb(finalUrls, res);
            }
        });
    })
        .on("error", function (err) {
        console.log("Error: " + err.message);
    });
}
// http listener function
function fetchGif(req, res) {
    if (req.url == null) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
        return;
    }
    var parsedUrl = new URL(req.url, "http://".concat(req.headers.host));
    if (parsedUrl.pathname != process.env.listenPath) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
        return;
    }
    console.log("-----------------------request recieved-----------------------");
    var requestQuery = parsedUrl.searchParams.get("q");
    if (requestQuery == null) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("invalid request");
        return;
    }
    console.log("request query: " + requestQuery);
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    // GifUrl.sync({ force: true }).then(() => {
    fetchFromDb(requestQuery, res);
    console.log("-----------------------request processed-----------------------");
    return;
    // });
}
// http listener initiation
http
    .createServer(fetchGif)
    .listen(process.env.listenPort, process.env.listenHost, function () {
    console.log("Server running at http://".concat(process.env.listenHost, ":").concat(process.env.listenPort, "/"));
});
