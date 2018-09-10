'use strict';

const express = require('express');

const User = require('../models/User');

const router = express.Router();

/* ========== POST/CREATE AN NEW USER ========== */
router.post('/', (req, res, next) => {
  // validate all required field were submitted
  const requiredFields = ['username', 'password', 'name'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    const err = new Error(`Missing \`${missingField}\` in request body`);
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = `${missingField}`;
    return next(err);
  }

  // validate fields that should be strings are actually of type 'string'
  const stringFields = ['username', 'password', 'name'];
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

  // validate that fields used to log in do not start or end with whitespace
  const explicitlyTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicitlyTrimmedFields.find(field => {
    return req.body[field].trim() !== req.body[field];
  });
  if (nonTrimmedField) {
    const err = new Error(
      `The \`${nonTrimmedField}\` cannot begin or end with whitespace`
    );
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = `${nonTrimmedField}`;
    return next(err);
  }

  // validate that fields with a required size meet the requirements
  const sizedFields = {
    name: {
      min: 1
    },
    username: {
      min: 1
    },
    password: {
      min: 10,
      max: 72 // bcrypt limit
    }
  };
  const tooShortField = Object.keys(sizedFields).find(
    field => 
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLongField = Object.keys(sizedFields).find(
    field => 
      'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
  );
  if (tooShortField || tooLongField) {
    const err = new Error(
      tooShortField
        ? `Must be at least ${sizedFields[tooShortField].min} characters long`
        : `Must be at most ${sizedFields[tooLongField].max} characters long`
    );
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = tooShortField || tooLongField;
    return next(err);
  }

  let { username, password, name } = req.body;
  // username & password come in pre-trimmed
  // otherwise we throw an error before this
  name = name.trim();

  return User
    .hashPassword(password)
    .then(digest => {
      return User.create({
        username,
        password: digest,
        name
      });
    })
    .then(user => {
      return res
        .location()
        .status(201)
        .json(user);
    })
    .catch(err => {
      // mongo err code for duplicate entry = 11000
      if (err.code === 11000) {
        err = new Error('Username already taken');
        err.status = 422;
        err.reason = 'ValidationError';
        err.location = 'username';
      }
      next(err);
    });
});

module.exports = router;