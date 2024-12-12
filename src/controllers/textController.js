const {
    getTextById,
    getTextsByUserId,
    insertText,
    deleteText,
    updateText
} = require('../services/textService');

const textController = {
    list: async (req, res) => {
        try {
            const {id} = req.user
            res.render('index', {texts: await getTextsByUserId(id)});
        } catch (error) {
            res.render('error', {status: error.status || 500, error: error.message});
        }
    },
    create: async (req, res) => {
        try {
            const {text} = req.body;
            const {id} = req.user
            await insertText(text, id);
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