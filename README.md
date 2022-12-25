# RuruFlashcards

Full-stack, single-page web application to create, manage, and study flash cards. Uses Google Cloud Text-to-Speech to read out card contents (useful for language learning), [Passport.js](https://www.passportjs.org/) for authentication, and [PaperCSS](https://www.getpapercss.com/) for a pleasant, hand-drawn look.

Live version at [ruruflashcards.herokuapp.com](https://ruruflashcards.herokuapp.com/)

## Building and Running

Install server and client dependencies and build client:

```
npm install
cd client
npm install
npm run build
cd ..
```

Run server normally:

```
npm run start
```

Run server automatically updating on any changes:

```
npm run server
```

Run client automatically updating on any changes:

```
npm run client
```

Run both automatically updating on any changes:

```
npm run both
```

Requires a `config.js` in the root directory with the following contents:

```js
module.exports = {
	GOOGLE_CLOUD_CREDENTIALS: '{Google Cloud Credentials JSON String}',
	MONGODB_URI: '{MongoDB URI}',
	SESSION_SECRET: '{Anything}',
}
```
