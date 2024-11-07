const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Event = sequelize.define('Event', {
    eventName: {
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
    time: {
        type: DataTypes.TIME,
    },
    comment: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
});

module.exports = Event;