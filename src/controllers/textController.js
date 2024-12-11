const {getTextById, insertText, findAllText, deleteText, updateText} = require('../services/textService');

const textController = {
    list: async (req, res) => {
        try {
            res.render('index', {texts: await findAllText()});
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    },
    create: async (req, res) => {
        try {
            const {text} = req.body;
            await insertText(text);
            res.redirect('/dashboard');
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    },
    edit: async (req, res) => {
        try {
            const {id} = req.params;
            res.render('edit', {
                text: await getTextById(id)
            });
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    },
    update: async (req, res) => {
        try {
            const {id} = req.params;
            const {text} = req.body;
            await updateText(id, text);
            res.redirect('/dashboard');
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    },
    delete: async (req, res) => {
        try {
            const {id} = req.params;
            await deleteText(id);
            res.redirect('/dashboard');
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    },
};

module.exports = textController;