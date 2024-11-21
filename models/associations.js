const Event = require('./event');
const Type = require('./type');

// Associations
Type.hasMany(Event, {
    foreignKey: 'types_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

Event.belongsTo(Type, {
    foreignKey: 'types_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = { Event, Type };
