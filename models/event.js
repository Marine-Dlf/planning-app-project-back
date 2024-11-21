const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Type = require('./type')

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
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
        allowNull: true,
    },
    comment: {
        type: DataTypes.STRING,
    },
    types_id: {
        type: DataTypes.UUID,
        references: {
            model: Type,
            key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: false,
});


module.exports = Event;