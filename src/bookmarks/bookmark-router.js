'use strict';

const express = require('express');
const BOOKMARKS = require('../DB');
const uuid = require('uuid/v4');
const { checkEntries } = require('./validations');
const { logger } = require('../util/middleware');
const { PORT } = require('../config');

const bookmarkRouter = express.Router();

bookmarkRouter
  .route('/')
  .get((req, res) => {
    res.status(200).json(BOOKMARKS);
  })
  .post(express.json(), (req, res, next) => {
    const { title, rating, description, url} = req.body;
    const errors = checkEntries(title, url, description, Number(rating));
    if (errors){
      logger.error(errors);
      return res.status(400).json(errors);
    }
    const id = uuid();
    BOOKMARKS.push({
      id,
      title,
      rating,
      description: (!!description && description.trim() !== '') ? description : '', 
      url
    });
    logger.info(`bookmark with id: ${id} has been added to the database`);
    return res.status(201)
      .location(`localhost:${PORT}/bookmarks/${id}`)
      .send({message: 'hello'});
    
  });

  





module.exports = bookmarkRouter;