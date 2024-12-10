const Text = require('../../../src/models/Text');
const {getTextById, findAllText, insertText, deleteText, updateText} = require('../../../src/services/textService');
const BadRequestError = require("../../../src/common/exceptions/badRequestError");
const NotFoundError = require("../../../src/common/exceptions/notFoundError");
const {fakeTexts, fakeText} = require('../../mocks');

jest.mock('../../../src/models/Text', () => ({
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
}));

describe('Text Service unit test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getTextById', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = getTextById();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw NotFoundError if text is not found', async () => {
            Text.findOne.mockResolvedValue(null);
            const res = getTextById(1);
            await expect(res).rejects.toThrow(NotFoundError);
            await expect(res).rejects.toThrow('Text not found!');
        });

        it('should return the text if found', async () => {
            Text.findOne.mockResolvedValue(fakeTexts[0]);

            const res = await getTextById(1);
            expect(Text.findOne).toHaveBeenCalledWith({where: {id: 1}});
            expect(res).toEqual(fakeTexts[0]);
        });
    });
    describe('findAllText', () => {
        it('should return all texts', async () => {
            Text.findAll.mockResolvedValue(fakeTexts);

            const res = await findAllText();
            expect(Text.findAll).toHaveBeenCalled();
            expect(res).toEqual(fakeTexts);
        });

        it('should throw an error if findAll fails', async () => {
            Text.findAll.mockRejectedValue(new Error('DB error'));

            const res = findAllText();
            await expect(res).rejects.toThrow('DB error');
        });

    });
    describe('insertText', () => {
        it('should throw BadRequestError if text is not provided', async () => {
            const res = insertText();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Text is required!');
        });

        it('should insert text and return the created text', async () => {
            Text.create.mockResolvedValue({id: 1, text: fakeText});

            const res = await insertText(fakeText);
            expect(Text.create).toHaveBeenCalledWith({text: fakeText});
            expect(res).toEqual({id: 1, text: fakeText});
        });
    });
    describe('deleteText', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = deleteText();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should delete the text and return the result', async () => {
            Text.destroy.mockResolvedValue(1); // Assume 1 row is deleted

            const res = await deleteText(1);
            expect(Text.destroy).toHaveBeenCalledWith({where: {id: 1}});
            expect(res).toBe(1);
        });

        it('should throw an error if deletion fails', async () => {
            Text.destroy.mockRejectedValue(new Error('DB error'));

            const res = deleteText(1);
            await expect(res).rejects.toThrow('DB error');
        });
    });
    describe('updateText', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = updateText(null, fakeText);

            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw BadRequestError if text is not provided', async () => {
            const res = updateText(1, null);

            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Text is required!');
        });

        it('should update the text and return the updated text', async () => {
            Text.update.mockResolvedValue([1]); // Assume 1 row is updated
            Text.findOne.mockResolvedValue({id: 1, text: fakeText});

            const res = await updateText(1, fakeText);
            expect(Text.update).toHaveBeenCalledWith({text: fakeText}, {where: {id: 1}});
            expect(Text.findOne).toHaveBeenCalledWith({where: {id: 1}});
            expect(res).toEqual({id: 1, text: fakeText});
        });

        it('should throw an error if update fails', async () => {
            Text.update.mockRejectedValue(new Error('DB error'));

            const res = updateText(1, fakeText);
            await expect(res).rejects.toThrow('DB error');
        });
    });
});