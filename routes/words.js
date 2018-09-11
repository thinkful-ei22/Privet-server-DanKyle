'use strict';

// npm packages
const express = require('express');
const passport = require('passport');

// models
const User = require('../models/User');

// initialization
const router = express.Router();

// middlewares
const options = { session: false, failWithError: true };
const jwtAuth = passport.authenticate('jwt', options);
router.use('/', jwtAuth);

router.get('/', (req, res, next) => {
  const userId = req.user.id;
  // console.log('userId: ', userId);

  // send the next question for that User
  User
    .findById(userId, 'questions')
    .populate('questions.wordId')
    .then(questions => {
      // console.log('questions: ', questions);
      if (questions) {
        let nextWord = {
          word: questions.questions[0].wordId.russian,
          translit: questions.questions[0].wordId.translit,
          id: questions.questions[0]._id
        };
        // console.log('nextWord: ', nextWord);
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