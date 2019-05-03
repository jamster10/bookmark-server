'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const { morgan_Settings, cors_Settings, logger } = require('./util/middleware.js');
const { errorHandler } = require('./util/error-handling');

const app = express();

const bookmarkRouter = require('./bookmarks/bookmark-router');

app.use(morgan(morgan_Settings));
app.use(helmet());
app.use(cors(cors_Settings));
app.use(checkAuthorization);


app.get('/', (req, res) => {
  res.send('Server running. Please make a request to /bookmarks');
});

app.use('/bookmarks', bookmarkRouter);

app.use('*', (res, req, next) => {
  res.status(404).JSON({ message: 'Resource not found'});
});

app.use(errorHandler);

function checkAuthorization(req, res, next){
  const userToken = req.get('Authorization');
  if (!userToken || userToken.split(' ')[1] !== process.env.API_KEY){
    logger.error(`Unauthorized attempt using key: ${userToken ? userToken.split(' ')[1] : 'null'}`);
    let error = {
      status: 401,
      message: 'You do not have access to this server. GO AWAY, OR ELSE'
    };
    return next(error);
  }
  next();
}

module.exports = app;