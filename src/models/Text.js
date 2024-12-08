const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Text = sequelize.define('Text', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    text: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
}, {timestamps: true});

module.exports = Text;