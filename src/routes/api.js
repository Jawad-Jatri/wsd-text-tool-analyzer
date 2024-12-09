const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/words/:id', apiController.wordCount)
    .get('/characters/:id', apiController.characterCount)
    .get('/sentences/:id', apiController.sentenceCount)
    .get('/paragraphs/:id', apiController.paragraphCount)
    .get('/longest-words/:id', apiController.longestWordsInParagraphs);

module.exports = router;