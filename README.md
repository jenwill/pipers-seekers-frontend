# Piper's Seekers Frontend Documentation

### Contents
* [Build Status](#Build-Status)

* [Getting Started](#getting-started)
* [Authors & Credits](#Authors)
* [Test Coverage](#Tests)
* [Architecture](#Architecture)

## Version

1.0.2

## Description

Piper's Seekers is a fork of the Finders Keepers frontend at  https://github.com/spyosaurus/finders-keepers-frontend
This fork was created by Finders Keepers team member Jennifer Piper, to allow her to freely modify and upgrade her own version of the original Finders Keepers game.


## Build Status

[![Build Status](https://travis-ci.org/jenwill/pipers-seekers-frontend.svg?branch=master)](https://travis-ci.org/jenwill/pipers-seekers-frontend)

## Architecture
Piper's Seekers is front-end only intended to be run with the Finder's Keepers back-end:
https://github.com/spyosaurus/finders-keepers-backend

Finder's Keepers is a full-stack JavaScript application, utilizing the following:

- Code Style: Airbnb
- Test Suite: Jest
- Transpiling: Babel
- Ajax Requests: Superagent
- Continuous Integration: Travis CI
- Misc: Eslint, dotenv

## Frontend
- View Library: React
- State Management: Redux
- Bundler: Webpack
- Style: Sass
### Misc 
- Css-loader,
- Enzyme, Prop-Types,
- mini-css-extra-plugin, html-webpack-plugin

## Backend
- Framework: Express
- Database: MongoDB
- Logging: Winston
- CORS: cors

## ENV Files
- In your forntend .env file, enter the following:
```
NODE_ENV=development
API_URL=http://localhost:3000
```

- In your backend .env file, enter the following:
```

NODE_ENV=development
PORT=3000
DEBUG=true
CORS_ORIGIN=http://localhost:8080

MONGODB_URI=mongodb://localhost/testing

FINDERS_SECRET=yoursecretcodegoeshere
```
## Getting Started:
1. Fork both FRONTEND AND BACKEND repositories from GitHub.
2. Clone the repo to your local machine.
3. Run the ```npm i``` command in the frontend and backend to install all required dependencies.
4. IN THE BACKEND, Run the ```node index.js``` command in your terminal.
5. IN THE BACKEND, Run the ```npm run test``` command in your terminal.
6. IN THE FRONTEND run the ```npm run test``` command to run testing on frontend.
7. IN THE FRONTEND run the ```npm run watch``` command to render application to the browser. 

## socket.IO
This application uses Socket.io in order to have multiplayer functionality in real time!
Players join a socket when they click "host" or "join" and after they have signed in or registered if they do not have an account.

## Tests
- Test Suite: Jest
- npm run test
- Backend Coverage:
- Frontend Coverage:

## Authors

Cara Ottmar, Collin Meredith, Jennifer Piper and Wyatt Pefley

## Credits 
- Thanks to Heath Smith for helping us debug the socket.io functionality.

License: MIT