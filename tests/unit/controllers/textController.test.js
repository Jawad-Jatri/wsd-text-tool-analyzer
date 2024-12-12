const BadRequestError = require("../../../src/common/exceptions/badRequestError");
const {list, create, edit, update, delete: del} = require('../../../src/controllers/textController');
const {fakeTexts, fakeText} = require('../../mocks');

jest.mock('../../../src/services/textService');
const textService = require('../../../src/services/textService');

describe('Text Controller unit test', () => {
    let req, res;
    beforeEach(() => {
        jest.clearAllMocks();
        req = {params: {}, user: {}};
        res = {
            render: jest.fn(),
            redirect: jest.fn()
        };
    });

    describe('list', () => {
        it('should render an index page', async () => {
            req.user.id = 1
            const textsByUser = fakeTexts.filter(obj => obj.UserId === req.user.id)
            textService.getTextsByUserId.mockResolvedValue(textsByUser);
            await list(req, res);
            expect(res.render).toHaveBeenCalledWith('index', {texts: textsByUser});
        });
        it('should throw error for DB issue', async () => {
            textService.getTextsByUserId.mockRejectedValue(new Error('DB Error'));
            await list(req, res);
            expect(res.render).toHaveBeenCalledWith('error', {status: 500, error: 'DB Error'});
        });
    });
    describe('create', () => {
        it('should redirect to \'/dashboard\' page after create', async () => {
            req.body = {text: fakeText};
            req.user.id = 1
            textService.insertText.mockResolvedValue({id: 1, ...fakeText, UserId: req.user.id});
            await create(req, res);
            expect(textService.insertText).toHaveBeenCalledWith(fakeText, req.user.id);
            expect(res.redirect).toHaveBeenCalledWith('/dashboard');
        });
        it('should throw error for blank text create', async () => {
            req.body = {text: null};
            req.user.id = 1
            textService.insertText.mockRejectedValue(new BadRequestError("Text is required!"));
            await create(req, res);
            expect(res.render).toHaveBeenCalledWith('error', {status: 400, error: 'Text is required!'});
        });
        it('should throw error for blank text create', async () => {
            req.body = {text: fakeText};
            req.user.id = 1
            textService.insertText.mockRejectedValue(new Error('DB Error'));
            await create(req, res);
            expect(res.render).toHaveBeenCalledWith('error', {status: 500, error: 'DB Error'});
        });
    });
    describe('edit', () => {
        it('should render edit page', async () => {
            req.params = {id: fakeTexts[0].id};
            textService.getTextById.mockResolvedValue(fakeTexts[0]);
            await edit(req, res);
            expect(textService.getTextById).toHaveBeenCalledWith(fakeTexts[0].id);
            expect(res.render).toHaveBeenCalledWith('edit', {text: fakeTexts[0]});
        });
        it('should throw error for invalid id to get edit page', async () => {
            req.params = {};
            textService.getTextById.mockRejectedValue(new BadRequestError("Id is required!"));
            await edit(req, res);
            expect(res.render).toHaveBeenCalledWith('error', {status: 400, error: 'Id is required!'});
        });
        it('should throw error for DB issue', async () => {
            req.params = {id: fakeTexts[0].id};
            textService.getTextById.mockRejectedValue(new Error('DB Error'));
            await edit(req, res);
            expect(res.render).toHaveBeenCalledWith('error', {status: 500, error: 'DB Error'});
        });
    });
    describe('update', () => {
        it('should redirect to \'/dashboard\' page after update', async () => {
            req.params = {id: fakeTexts[0].id};
            req.body = {text: fakeText};
            textService.updateText.mockResolvedValue({...fakeTexts[0], text: fakeText});
            await update(req, res);
            expect(textService.updateText).toHaveBeenCalledWith(fakeTexts[0].id, fakeText);
            expect(res.redirect).toHaveBeenCalledWith('/dashboard');
        });
        it('should throw error for invalid text on update', async () => {
            req.params = {id: fakeTexts[0].id};
            req.body = {text: null};
            textService.updateText.mockRejectedValue(new BadRequestError("Text is required!"));
            await update(req, res);
            expect(res.render).toHaveBeenCalledWith('error', {status: 400, error: 'Text is required!'});
        });
        it('should throw error for DB issue', async () => {
            req.params = {id: fakeTexts[0].id};
            req.body = {text: fakeText};
            textService.updateText.mockRejectedValue(new Error('DB Error'));
            await update(req, res);
            expect(res.render).toHaveBeenCalledWith('error', {status: 500, error: 'DB Error'});
        });
    });
    describe('delete', () => {
        it('should redirect to \'/dashboard\' page after delete', async () => {
            req.params = {id: fakeTexts[0].id};
            textService.deleteText.mockResolvedValue({});
            await del(req, res);
            expect(textService.deleteText).toHaveBeenCalledWith(fakeTexts[0].id);
            expect(res.redirect).toHaveBeenCalledWith('/dashboard');
        });
        it('should throw error for invalid text on delete', async () => {
            req.params = {};
            textService.deleteText.mockRejectedValue(new BadRequestError("Id is required!"));
            await del(req, res);
            expect(res.render).toHaveBeenCalledWith('error', {status: 400, error: 'Id is required!'});
        });
        it('should throw error for DB issue', async () => {
            req.params = {id: fakeTexts[0].id};
            textService.deleteText.mockRejectedValue(new Error('DB Error'));
            await del(req, res);
            expect(res.render).toHaveBeenCalledWith('error', {status: 500, error: 'DB Error'});
        });
    });
});
