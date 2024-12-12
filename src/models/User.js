const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    googleId: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN(),
        allowNull: false,
        defaultValue: true,
    },
}, {timestamps: true});

module.exports = User;