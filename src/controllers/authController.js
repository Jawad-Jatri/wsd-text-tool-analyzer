const jwt = require('jsonwebtoken');
const config = require('../config');
const successResponse = require("../common/response/successResponse");
const BadRequestError = require("../common/exceptions/badRequestError");

const authController = {
    login: async (req, res) => {
        try {
            res.render('login');
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    },
    callback: async (req, res, next) => {
        try {
            const {state} = req.query;
            console.log('state', state);
            if (state === 'web') {
                res.redirect('/dashboard');
            } else if (state === 'api') {
                const token = jwt.sign({id: req.user.id}, config.oauth.jwtToken, {expiresIn: '1h'});
                console.log('token', token);
                return successResponse(res, {accessToken: token});
            } else {
                next(new BadRequestError("Invalid state"));
            }
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    },
    logout: async (req, res) => {
        try {
            // Implement OAuth callback logic
            //...
        } catch (err) {
            // Handle error
            //...
        }
    }
};
module.exports = authController;