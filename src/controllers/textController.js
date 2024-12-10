const {getTextById, insertText, findAllText, deleteText, updateText} = require('../services/textService')

const textController = {
    list: async (req, res) => {
        try {
            res.render('index', {texts: await findAllText()});
        } catch (error) {

        }
    },
    create: async (req, res) => {
        try {
            const {text} = req.body;
            await insertText(text);
            res.redirect('/');
        } catch (error) {

        }
    },
    edit: async (req, res) => {
        try {
            const {id} = req.params;
            res.render('edit', {
                text: await getTextById(id)
            });
        } catch (error) {

        }
    },
    update: async (req, res) => {
        try {
            const {id} = req.params;
            const {text} = req.body;
            await updateText(id, text);
            res.redirect('/');
        } catch (error) {

        }
    },
    delete: async (req, res) => {
        try {
            const {id} = req.params;
            await deleteText(id)
            res.redirect('/');
        } catch (error) {

        }
    },
};

module.exports = textController;