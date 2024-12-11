const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');
const authController = require('../controllers/authController');
const isAuthenticated = require('../middlewares/isAuthenticated')

router.get('/', authController.login)
    .get('/dashboard', isAuthenticated, textController.list)
    .post('/create', isAuthenticated, textController.create)
    .get('/edit/:id', isAuthenticated, textController.edit)
    .post('/edit/:id', isAuthenticated, textController.update)
    .post('/delete/:id', isAuthenticated, textController.delete);

router.use('/api', require('./api'));
router.use('/auth', require('./auth'));

module.exports = router;