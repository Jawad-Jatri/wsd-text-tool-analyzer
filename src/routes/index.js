const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');

router.get('/', textController.list);
router.post('/create', textController.create);
router.get('/edit/:id', textController.edit);
router.post('/edit/:id', textController.update);
router.post('/delete/:id', textController.delete);

module.exports = router;