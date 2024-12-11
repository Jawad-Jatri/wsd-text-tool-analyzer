const sequelize = require('../config/db');
const Text = require('../models/Text');
const User = require('../models/User');

const db = {
    sequelize,
    Text,
    User
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