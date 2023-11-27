# RuruFlashcards

Full-stack, single-page web application to create, manage, and study flash cards, with user authentication and Google Cloud Text-to-Speech in multiple languages (great for language study 📚🌏).

Live at [ruruflashcards.com](http://ruruflashcards.com/)

## Project Description

The client is made with React and TypeScript, built with Vite, and styled with [PaperCSS](https://www.getpapercss.com/) for a pleasant, hand-drawn look.

State is managed with the React Context API and basic prop passing. (Previously, Redux was used, but it was too much overhead for such a simple app.) Client settings are stored in local storage.

API requests are made with GraphQL. (Will later be replaced with a simple REST API.)

The server runs on Node.js and is made with Express and TypeScript. Data is stored on a cloud-based MongoDB database. (Will later be replaced with a self-hosted SQL database.) Authentication is performed with Passport.js using a local username/password strategy.

The entire application is deployed in a Docker container in a single Amazon EC2 instance. A Github Actions workflow triggered on push to a deploy branch builds the image, pushes it to Amazon ECR, pulls it into the EC2 instance, and runs the container.

Google Cloud Text-to-Speech is used to read out card contents.

## Future Plans

- Host client statically in an Amazon S3 bucket
- Replace GraphQL API with REST API
- Replace MongoDB with self-hosted SQL DB
- Set up SSL
- Cache TTS responses
- Rework CSS
- Add support for multiple decks

## Building and Running

Build server and client: `npm run build`  
Run server normally: `npm run start`  
Run server automatically updating on any changes: `npm run dev-server`  
Run client automatically updating on any changes: `npm run dev-client`  
Run both automatically updating on any changes: `npm run dev-both`  

Requires a `.env` in the server directory based on `.env.example` (or manually set environment variables).
