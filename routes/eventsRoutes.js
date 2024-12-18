const express = require('express');
const router = express.Router();
const { Event, Type } = require('../models/associations');


// Retrieving and displaying data from the "events" table in my database
router.get("/", async(req, res) => {
    try {
        const events = await Event.findAll();       // Get all events
        res.status(200).json(events);               // Returns events in json
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// Retrieving and displaying a single event based on their ID
router.get("/:id", async(req, res) => {
    try {
        const id = req.params.id
        const event = await Event.findByPk(id);
        res.status(200).json(event);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'événement:", error);
        res.status(500).send('Erreur serveur');
    }
});


// Creating a route to add (CREATE) new events: POST method
router.post('/', async(req, res) => {
    const { eventName, date, time, location, comment, types_id } = req.body         // Data sent in the body of the request
    console.log('Données reçues pour création d\'événement:', req.body);
    // Check if eventName is empty
    if (!eventName || eventName.trim() === '') {
        return res.status(400).json({ error: "Le nom de l'événement est requis" });
    }
    
    try {
        const newEvent = await Event.create({ eventName, date, time, location, comment, types_id })
        res.status(201).json(newEvent)
    } catch (error) {
        console.error("Erreur de création :", error);
        res.status(500).send("Erreur serveur"); 
    }
});


// Creating a route to UPDATE (modify) an event: PUT method (updates everything) - patch method (updates only certain fields)
router.put('/:id', async(req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);      // Find the event by its ID
        if (event) {
            let condition = { where :{id: req.params.id} };     // "where" tells Sequelize which entries in the events table to update (here, only the entry with the matching ID (req.params.id) will be updated)
            await Event.update(req.body, condition);            // Data update
            res.status(200).json(event);
        } else {
            res.status(404).send('Evènement non trouvé');
        }
    } catch (error) {
        console.error("Erreur de mise à jour :", error);
        res.status(500).send("Erreur serveur");
    }
});


// Creating a route to DELETE an event: DELETE method
router.delete("/:id", async(req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (event) {
            await Event.destroy({ where :{id: req.params.id}})
            res.status(200).json('Evènement supprimé avec succès')
        } else {
            res.status(404).send('Evènement non trouvé')
        }
    } catch (error) {
        console.error("Erreur de suppression :", error);
        res.status(500).send("Erreur serveur");
    }
});


module.exports = router;