const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require("../config/passport");

router.get('/google/web', passport.authenticate('google', {scope: ['profile', 'email'], state: 'web'}))
    .get('/google/api', passport.authenticate('google', {scope: ['profile', 'email'], state: 'api'}))
    .get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), authController.callback)
    .get('/logout', authController.logout);
module.exports = router;