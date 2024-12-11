const BadRequestError = require("../common/exceptions/badRequestError");
const successResponse = require("../common/response/successResponse");
const authService = require("../services/authService");

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
            if (state === 'web') {
                res.redirect('/dashboard');
            } else if (state === 'api') {
                return successResponse(res, {accessToken: await authService.generateToken(req.user.id)});
            } else {
                next(new BadRequestError("Invalid state"));
            }
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    },
    logout: async (req, res) => {
        try {
            res.redirect('/');
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    }
};
module.exports = authController;