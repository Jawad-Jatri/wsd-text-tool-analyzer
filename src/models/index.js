const sequelize = require('../config/db');
const Text = require('../models/Text');

const db = {
    sequelize,
    Text,
};

(async () => {
    try {
        await sequelize.sync({alter: true}); // Sync all models
        console.log('All models synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
})();

module.exports = db;