'use strict';

const express = require('express');

require('dotenv').config();

const app = express();

app.use(express.static(`${__dirname}/build`));

app.get('*', (request, response) => {
  response.sendFile(`${__dirname}/build/index.html`);
});

app.listen(process.env.PORT, () => {
  console.log('__SERVER_UP__ on port ', process.env.PORT);
});
