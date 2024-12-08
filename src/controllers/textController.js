const Text = require('../models/text');

const textController = {
    list: async (req, res) => {
        res.render('index', {texts: await Text.findAll()});
    },
    create: async (req, res) => {
        const {text} = req.body;
        await Text.create({text});
        res.redirect('/');
    },
    edit: async (req, res) => {
        const {id} = req.params;
        res.render('edit', {
            text: await Text.findOne(
                {where: {id}}
            )
        });
    },
    update: async (req, res) => {
        const {id} = req.params;
        const {text} = req.body;
        await Text.update({text},
            {where: {id: id}});
        res.redirect('/');
    },
    delete: (req, res) => {
        const {id} = req.params;
        Text.destroy({where: {id: id}});
        res.redirect('/');
    },
};

module.exports = textController;