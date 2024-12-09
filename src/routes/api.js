const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const rateLimiter = require('../common/limiter/rate-limit');

router.get('/words/:id', rateLimiter, apiController.wordCount)
    .get('/characters/:id', rateLimiter, apiController.characterCount)
    .get('/sentences/:id', rateLimiter, apiController.sentenceCount)
    .get('/paragraphs/:id', rateLimiter, apiController.paragraphCount)
    .get('/longest-words/:id', rateLimiter, apiController.longestWordsInParagraphs);

module.exports = router;