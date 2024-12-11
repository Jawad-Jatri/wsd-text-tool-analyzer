const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const rateLimiter = require('../common/limiter/rate-limit');
const isAuthenticatedUser = require("../middlewares/isAuthenticatedUser");

router.get('/words/:id', isAuthenticatedUser, rateLimiter, apiController.wordCount)
    .get('/characters/:id', isAuthenticatedUser, rateLimiter, apiController.characterCount)
    .get('/sentences/:id', isAuthenticatedUser, rateLimiter, apiController.sentenceCount)
    .get('/paragraphs/:id', isAuthenticatedUser, rateLimiter, apiController.paragraphCount)
    .get('/longest-words/:id', isAuthenticatedUser, rateLimiter, apiController.longestWordsInParagraphs);

module.exports = router;