'use strict';

const express = require('express');
const passport = require('passport');

const { createAuthToken } = require('../utils/auth');

const router = express.Router();

const options = { session: false, failWithError: true };
const localAuth = passport.authenticate('local', options);

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

module.exports = router;
