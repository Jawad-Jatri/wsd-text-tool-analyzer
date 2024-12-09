const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');

router.get('/', textController.list)
    .post('/create', textController.create)
    .get('/edit/:id', textController.edit)
    .post('/edit/:id', textController.update)
    .post('/delete/:id', textController.delete);

router.use('/api', require('./api'));

module.exports = router;