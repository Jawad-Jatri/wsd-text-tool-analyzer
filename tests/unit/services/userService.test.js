const {
    getUserById, insertUser, findOrCreateUserByEmail
} = require('../../../src/services/userService');
const BadRequestError = require("../../../src/common/exceptions/badRequestError");
const NotFoundError = require("../../../src/common/exceptions/notFoundError");
const {fakeUser} = require('../../mocks');

jest.mock('../../../src/models', () => {
    const {fakeUser} = require('../../mocks');
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    const UserMock = dbMock.define('User', fakeUser);
    return {
        User: UserMock,
    };
});

describe('User Service unit test', () => {
    let UserMock;

    beforeAll(() => {
        const {User} = require('../../../src/models');
        UserMock = User;
    });

    describe('getUserById', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = getUserById();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw NotFoundError if user is not found', async () => {
            UserMock.findOne = jest.fn().mockResolvedValue(null);
            const res = getUserById(1);
            await expect(res).rejects.toThrow(NotFoundError);
            await expect(res).rejects.toThrow('User not found!');
        });

        it('should return the user if found', async () => {
            UserMock.findOne = jest.fn().mockResolvedValue(fakeUser);

            const res = await getUserById(1);
            expect(UserMock.findOne).toHaveBeenCalledWith({where: {id: 1}});
            expect(res).toEqual(fakeUser);
        });
    });

    describe('insertUser', () => {
        it('should throw BadRequestError if name is not provided', async () => {
            const res = insertUser(null, fakeUser.email, fakeUser.googleId);
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Name is required!');
        });

        it('should throw BadRequestError if email is not provided', async () => {
            const res = insertUser(fakeUser.name, null, fakeUser.googleId);
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Email is required!');
        });

        it('should throw BadRequestError if googleId is not provided', async () => {
            const res = insertUser(fakeUser.name, fakeUser.email, null);
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Google ID is required!');
        });

        it('should insert user and return the created user', async () => {
            UserMock.create = jest.fn().mockResolvedValue({id: 1, ...fakeUser});

            const res = await insertUser(fakeUser.name, fakeUser.email, fakeUser.googleId);
            expect(UserMock.create).toHaveBeenCalledWith({...fakeUser});
            expect(res).toEqual({id: 1, ...fakeUser});
        });
    });

    describe('findOrCreateUserByEmail', () => {
        it('should throw BadRequestError if name is not provided', async () => {
            const res = findOrCreateUserByEmail(null, fakeUser.email, fakeUser.googleId);
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Name is required!');
        });

        it('should throw BadRequestError if email is not provided', async () => {
            const res = findOrCreateUserByEmail(fakeUser.name, null, fakeUser.googleId);
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Email is required!');
        });

        it('should throw BadRequestError if googleId is not provided', async () => {
            const res = findOrCreateUserByEmail(fakeUser.name, fakeUser.email, null);
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Google ID is required!');
        });

        it('should get user email already exist', async () => {
            UserMock.findOne = jest.fn().mockResolvedValue({id: 1, ...fakeUser});

            const res = await findOrCreateUserByEmail(fakeUser.name, fakeUser.email, fakeUser.googleId);
            expect(UserMock.create).not.toHaveBeenCalledWith();
            expect(UserMock.findOne).toHaveBeenCalledWith({where: {email: fakeUser.email}});
            expect(res).toEqual({id: 1, ...fakeUser});
        });

        it('should insert user and return the created user', async () => {
            UserMock.create = jest.fn().mockResolvedValue({id: 1, ...fakeUser});
            UserMock.findOne = jest.fn().mockResolvedValue(null);

            const res = await findOrCreateUserByEmail(fakeUser.name, fakeUser.email, fakeUser.googleId);
            expect(UserMock.create).toHaveBeenCalledWith(fakeUser);
            expect(UserMock.findOne).toHaveBeenCalledWith({where: {email: fakeUser.email}});
            expect(res).toEqual({id: 1, ...fakeUser});
        });
    });
});