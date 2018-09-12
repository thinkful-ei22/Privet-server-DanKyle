'use strict';

// npm packages
const express = require('express');
const mongoose = require('mongoose');
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

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('The `userId` is not valid');
    err.status = 400;
    return next(err);
  }

  // send the next question for that User
  User
    .findById(userId, 'questions')
    .populate('questions.wordId')
    .then(results => {
      if (results) {
        let nextWord = {
          word: results.questions[0].wordId.russian,
          translit: results.questions[0].wordId.translit,
          questionId: results.questions[0]._id
        };
        res.json(nextWord);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const userId = req.user.id;
  req.body.userId = userId;
  
  // validate all required field were submitted
  const requiredFields = ['questionId', 'answer'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    const err = new Error(`Missing \`${missingField}\` in request body`);
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = `${missingField}`;
    return next(err);
  }
  
  // validate fields that should be strings are actually of type 'string'
  const stringFields = ['questionId', 'answer'];
  const nonStringField = stringFields.find(field => {
    return ((req.body[field]) && (typeof req.body[field] !== 'string'));
  });
  if (nonStringField) {
    const err = new Error(`The \`${nonStringField}\` must be of type \`string\``);
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = `${nonStringField}`;
    return next(err);
  }
  
  // validate fields that should be mongoose ObjectIds are valid ObjectIds
  const objectIdFields = ['userId', 'questionId'];
  const nonObjectIdField = objectIdFields.find(field => {
    return ((req.body[field]) && !mongoose.Types.ObjectId.isValid(req.body[field]));
  });
  if (nonObjectIdField) {
    const err = new Error(`The \`${nonObjectIdField}\` must be a valid ObjectId`);
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = `${nonObjectIdField}`;
    return next(err);
  }
  
  // checked for existence and 'stringness' above,
  // otherwise would have thrown an error already
  let { questionId, answer } = req.body;
  answer = answer.trim().toLowerCase();
  // let qIndex = 0;
  const response = {};
  
  User
    .findById(userId, 'name questions')
    .populate('questions.wordId')
    .then(results => {
      /*
        current algorithm ensures that the current question
        is the first element in the array. if that changes,
        use qIndex to find the right question. if that isn't
        needed after implementing the updated algo, delete
        this section
      */
      // qIndex = results.questions.findIndex(
      //   item => item._id = questionId
      // );

      const question = results.questions.shift();
      response.answer = question.wordId.english;
      response.correct = (answer === response.answer);
      const wordScore = response.correct ? 1 : -1;
      question.score += wordScore;
      question.attempts += 1;
      
      results.questions.push(question);
      
      return results.save();
    })
    .then(() => {
      return res.json(response);
    })
    .catch(err => {
      next(err);
    });

  //* find the right user (populate 'questions')
  //* find the right wordId
  // check the answer against the 'english' key (.trim().toLowerCase())
  // if wrong ->
  //    console.log('WRONG')
  //    increment attempts by 1
  //    decrement score by 1
  //    remove item from beginning of questions array
  //    add to end of questions array
  //    return { correct: 'false', answer: correctAnswer }
  // if correct ->
  //    console.log('WINNER')
  //    increment attempts by 1
  //    increment score by 1
  //    remove item from beginning of questions array
  //    add to end of questions array
  //    return { correct: 'true', answer: correctAnswer }


});

module.exports = router;
