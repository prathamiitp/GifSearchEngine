# GifSearchEngine
It is a gif-searching service that uses giphy.com's public API.   
It also employs a database layer in between to cache searches and speed up the response in case of repeated queries.  

## To run

1) Instal all node dependencies from package.json
2) transpile the typescript file `./backend/fetchGifAPI.ts` using tsc command to make a javascript file from typescript file.
3) run the backend server using `node ./backend/fetchGifAPI.ts`
4) run the frontend by `live server` extension or directly by running the `./backend/index.html` file in browser.

You will need a mysql database named gifs

add all env variable to .env file in similar manner as shown in .env_example file

## Tech Stack
`Node.js`, `typeScript`, `javaScript`, `mySQL`, and `sequelize ORM`
