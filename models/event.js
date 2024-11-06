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
    location: {
        type: DataTypes.STRING,
    },
    schedules: {
        type: DataTypes.TIME,
    },
    comment: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
});

module.exports = Event;