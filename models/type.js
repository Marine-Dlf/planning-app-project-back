const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Event = require('./event')


const Type = sequelize.define('Type', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        // allowNull: false,
    },
    typeName: {
        type: DataTypes.STRING,
        // allowNull: false,
    },
}
, {
    timestamps: false,
});


module.exports = Type;