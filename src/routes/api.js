const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const rateLimiter = require('../common/limiter/rate-limit');
const isAuthenticated = require("../middlewares/isAuthenticated");

router.get('/words/:id', isAuthenticated, rateLimiter, apiController.wordCount)
    .get('/characters/:id', isAuthenticated, rateLimiter, apiController.characterCount)
    .get('/sentences/:id', isAuthenticated, rateLimiter, apiController.sentenceCount)
    .get('/paragraphs/:id', isAuthenticated, rateLimiter, apiController.paragraphCount)
    .get('/longest-words/:id', isAuthenticated, rateLimiter, apiController.longestWordsInParagraphs);

module.exports = router;