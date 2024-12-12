const BadRequestError = require("../../../src/common/exceptions/badRequestError");
const NotFoundError = require("../../../src/common/exceptions/notFoundError");
const {fakeUser} = require('../../mocks');
const {generateToken, verifyToken} = require('../../../src/services/authService')
const jwt = require('jsonwebtoken');
const userService = require('../../../src/services/userService');
const config = require('../../../src/config');
const ForbiddenError = require("../../../src/common/exceptions/forbiddenError");


jest.mock('jsonwebtoken');
jest.mock('../../../src/services/userService');

describe('User Service unit test', () => {
    describe('generateToken', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = generateToken();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow("User id is required!");
        });

        it('should generate token', async () => {
            const user = userService.getUserById.mockResolvedValue({id: 1, ...fakeUser});
            jwt.sign.mockReturnValue('mockedToken');
            const res = await generateToken(1);
            await expect(res).toBe('mockedToken');
            await expect(jwt.sign).toHaveBeenCalledWith({id: user.id}, config.oauth.jwtToken, {expiresIn: '1h'});
        });
    });

    describe('verifyToken', () => {
        it('should throw Forbidden error', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => callback('error', null));

            const res = verifyToken('invalidToken', () => {
            })
            await expect(res).rejects.toThrow(ForbiddenError);
            await expect(res).rejects.toThrow('Forbidden');
        });

        it('should send valid token', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => callback(null, {id: 1}));
            const callback = jest.fn();

            await verifyToken('validToken', callback);

            expect(callback).toHaveBeenCalledWith({id: 1});
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
});