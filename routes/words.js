'use strict';

// npm packages
const express = require('express');
const passport = require('passport');

// models
const Word = require('../models/Word');
const User = require('../models/User');

// initialization
const router = express.Router();

// middlewares
const options = { session: false, failWithError: true };
const jwtAuth = passport.authenticate('jwt', options);
router.use('/', jwtAuth);

router.get('/', (req, res, next) => {
  const userId = req.user.id;
  console.log('userId: ', userId);

  // send the next question for that User
  User
    .findById(userId, 'words')
    .populate('words.wordId')
    .then(words => {
      console.log('words: ', words);
      if (words) {
        let nextWord = {
          word: words.words[0].wordId.russian,
          translit: words.words[0].wordId.translit,
          id: words.words[0]._id
        };
        console.log('nextWord: ', nextWord);
        res.json(nextWord);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;