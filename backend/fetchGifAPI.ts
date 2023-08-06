import * as http from "http";
import * as https from "https";
import * as GifUrl from "./model/url";
import "dotenv/config";

// https://api.giphy.com/v1/gifs/search?q=requestQuery&api_key=dhGatsWyo2dHB0vT8oyybsYlNGYfCQoD
const giphyUrl: string = "https://api.giphy.com/v1/gifs/search?q=";
const giphyApiKey: string = "&api_key=dhGatsWyo2dHB0vT8oyybsYlNGYfCQoD";

// try to fetch data from db, if doesnt exist then fetch from giphy api
function fetchFromDb(requestQuery: string, res: http.ServerResponse): void {
  console.log("fetching from db");
  GifUrl.findAll({
    where: {
      name: requestQuery,
    },
  }).then((result) => {
    if (result.length == 0) {
      console.log("len=0");
      fetchFromGiphy(requestQuery, res);
    } else {
      console.log("response generated");
      res.end(JSON.stringify({ data: result }));
    }
  });
}

// add the data to the database
function addToDb(
  values: { name: string; url: string }[],
  res: http.ServerResponse
): void {
  console.log("adding to db");
  GifUrl.bulkCreate(values).then((result) => {
    console.log("response generated");
    res.end(JSON.stringify({ data: result }));
  });
}

// fetch data from giphy api
function fetchFromGiphy(requestQuery: string, res: http.ServerResponse): void {
  console.log("fetching from giphy");
  // making http get request to giphy api
  https
    .get(
      giphyUrl + requestQuery + giphyApiKey,
      (resp: http.IncomingMessage) => {
        console.log("Recieving response...");
        let responseData: string = "";
        let finalUrls: { name: string; url: string }[] = [];
        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          responseData += chunk;
        });
        console.log("response recieved");
        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          //get the data of gifs only, remove the pagenation and other response
          let responseDataJson: any[] = JSON.parse(responseData).data;

          //get the final urls in an array
          responseDataJson.forEach((i) => {
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
          } else {
            addToDb(finalUrls, res);
          }
        });
      }
    )
    .on("error", (err: Error) => {
      console.log("Error: " + err.message);
    });
}

// http listener function
function fetchGif(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.url == null) {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("404 Not Found");
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  if (parsedUrl.pathname != process.env.listenPath) {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("404 Not Found");
    return;
  }

  console.log("-----------------------request recieved-----------------------");

  const requestQuery: string | null = parsedUrl.searchParams.get("q");
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
  .listen(
    <number>(<unknown>process.env.listenPort),
    process.env.listenHost,
    () => {
      console.log(
        `Server running at http://${process.env.listenHost}:${process.env.listenPort}/`
      );
    }
  );
