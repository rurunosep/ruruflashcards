# RuruFlashcards

Full-stack, single-page web application to create, manage, and study flash cards, with user authentication and Google Cloud Text-to-Speech in multiple languages (great for language study 📚🌏).

Live at [ruruflashcards.herokuapp.com](https://ruruflashcards.herokuapp.com/)

## Techs and Libraries Used

The client is made with React and TypeScript, built with Create React App, and styled with [PaperCSS](https://www.getpapercss.com/) for a pleasant, hand-drawn look.

State is managed with the React Context API and basic prop passing. (Previously, Redux was used, but it was too heavy-weight for such a simple app.) Client settings are stored in local storage.

API requests are made with GraphQL. (Might later be replaced with a much lighter-weight REST API.)

The server runs on Node.js and is made with Express. Data is stored on a cloud-based MongoDB database. (Might later be replaced with a SQL database.) Authentication is performed with Passport.js using a local username/password strategy.

Google Cloud Text-to-Speech is used to read out card contents.

## Building and Running

Install server and client dependencies and build client:

```shell
npm install
cd client
npm install
npm run build
cd ..
```

Run server normally: `npm run start`  
Run server automatically updating on any changes: `npm run server`  
Run client automatically updating on any changes: `npm run client`  
Run both automatically updating on any changes: `npm run both`

Requires a `.env` in the root directory with the following contents:

```dosini
GOOGLE_CLOUD_CREDENTIALS='{Google Cloud Credentials JSON String}',
MONGODB_URI='{MongoDB URI}',
SESSION_SECRET='{Anything}',
```
