const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Event = sequelize.define('Event', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    schedules: {
        type: DataTypes.TIME,
    },
    comment: {
        type: DataTypes.STRING,
    },
});

module.exports = Event;