const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');
const authController = require('../controllers/authController');
const isAuthenticated = require('../middlewares/isAuthenticated')

router.get('/', authController.login)
    .get('/dashboard', isAuthenticated, textController.list)
    .get('/logout', isAuthenticated, authController.logout)
    .post('/create', isAuthenticated, textController.create)
    .get('/edit/:id', isAuthenticated, textController.edit)
    .get('/report/:id', isAuthenticated, textController.report)
    .post('/edit/:id', isAuthenticated, textController.update)
    .post('/delete/:id', isAuthenticated, textController.delete);

router.use('/api', require('./api'));
router.use('/auth', require('./auth'));

module.exports = router;