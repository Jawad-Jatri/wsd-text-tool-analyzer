const BadRequestError = require("../../../src/common/exceptions/badRequestError");
const {login, callback, logout} = require('../../../src/controllers/authController');
const {fakeTexts, fakeText, fakeTextAnalysisReport} = require('../../mocks');

jest.mock("../../../src/common/response/successResponse");
const successResponse = require("../../../src/common/response/successResponse");

jest.mock('../../../src/services/authService');
const authService = require('../../../src/services/authService');
const textService = require("../../../src/services/textService");

describe('Auth Controller unit test', () => {
    let req, res, next;
    beforeEach(() => {
        jest.clearAllMocks();
        req = {params: {}};
        res = {
            render: jest.fn(),
            redirect: jest.fn()
        };
        next = jest.fn();
        successResponse.mockImplementation((res, data) => res.status(200).json(data));
    });

    describe('login', () => {
        it('should render an login page', async () => {
            await login(req, res);
            expect(res.render).toHaveBeenCalledWith('login');
        });
    });
    describe('callback', () => {
        it('should redirect to \'/dashboard\' page ', async () => {
            req.query = {state: 'web'};
            await callback(req, res, next);
            expect(authService.generateToken).not.toHaveBeenCalledWith();
            expect(res.redirect).toHaveBeenCalledWith('/dashboard');
        });
        it('should return with token', async () => {
            req.query = {state: 'api'};
            req.user = {id: 1};
            authService.generateToken.mockResolvedValue('token');
            await callback(req, res, next);
            expect(authService.generateToken).toHaveBeenCalledWith(req.user.id);
            expect(successResponse).toHaveBeenCalledWith(res, {accessToken: 'token'});
            expect(next).not.toHaveBeenCalled();
        });
        it('should throw error invalid state', async () => {
            req.query = {state: null};
            req.user = {id: 1};

            await callback(req, res, next);

            expect(authService.generateToken).not.toHaveBeenCalledWith();
            expect(successResponse).not.toHaveBeenCalledWith();
            expect(res.redirect).not.toHaveBeenCalledWith('/dashboard');
            expect(next).toHaveBeenCalledWith(new BadRequestError("Invalid state"));
        });
        it('should throw error for DB error', async () => {
            req.query = {state: 'api'};
            req.user = {id: 1};
            authService.generateToken.mockRejectedValue(new Error("DB error"));

            await callback(req, res, next);

            expect(authService.generateToken).toHaveBeenCalledWith(req.user.id);
            expect(successResponse).not.toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('error', {status: 500, error: 'DB error'});
        });
    });
    describe('logout', () => {
        it('should redirect logout page', async () => {
            await logout(req, res);
            expect(res.redirect).toHaveBeenCalledWith('/');
        });
    });
});
