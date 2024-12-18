const express = require('express')
const router = express.Router()
const { Event, Type } = require('../models/associations');


// Route GET to retrieve all types
router.get('/', async (req, res) => {
    try {
        const types = await Type.findAll();
        res.status(200).json(types);         // Return list of types
    } catch (error) {
        console.error('Erreur lors de la récupération des types:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// Creating a route to add (CREATE) new types: POST method
router.post('/', async(req, res) => {
    const { typeName } = req.body
    // Checks if typeName is empty
    if (!typeName || typeName.trim() === '') {
        return res.status(400).json({ error: "Le nom du type est requis" });
    }

    try {
        const newType = await Type.create( { typeName })
        console.log("Type créé avec succès :", newType);
        res.status(201).json(newType)
    } catch (error) {
        console.log("Erreur de création :", error)
        res.status(500).send("Erreur serveur")
    }
});


// Creating a route to UPDATE (modify) a type: PUT method
router.put('/:id', async(req, res) => {
    try {
        const type = await Type.findByPk(req.params.id)
        if (type) {
            await Type.update(req.body, {where :{id: req.params.id}})
            res.status(200).json(type)
        } else {
            res.status(400).send('Type non trouvé')
        }
    } catch (error) {
        console.error("Erreur de mise à jour :", error)
        res.status(500).send("Erreur serveur")
    }
});


module.exports = router;