const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require("../config/passport")

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
    .get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), authController.callback)
    .get('/logout', authController.logout)
// router.get('/google/callback', (req, res, next) => {
//     passport.authenticate('google', (err, user, info) => {
//         if (err) {
//             console.error('Error during Google OAuth callback:', err);
//             return next(err);
//         }
//         if (!user) {
//             console.error('Authentication failed:', info);
//             return res.redirect('/');
//         }
//         req.logIn(user, (err) => {
//             if (err) {
//                 console.error('Error logging in user:', err);
//                 return next(err);
//             }
//             res.redirect('/dashboard');
//         });
//     })(req, res, next);
// });
module.exports = router;