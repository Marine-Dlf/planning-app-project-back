const express = require('express');
const router = express.Router();
const User = require('../models/user.js');


// Retrieving and displaying data from the "users" table in my database
router.get("/", async(req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des users:', error);
        res.status(500).send('Erreur serveur');
    }
});


// Retrieving and displaying a single user based on their ID
router.get("/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        res.status(200).json(user)
    } catch (error) {
        console.error('Erreur lors de la récupération du user:', error);
        res.status(500).send('Erreur serveur');
    }
});


// Creating a route to add (CREATE) new users: POST method
router.post('/', async(req,res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser)
    } catch (error) {
        console.error("Erreur de création :", error);
        res.status(500).send("Erreur serveur");
    }
});


// Creating a route to UPDATE (modify) a user: PUT method
router.put("/id", async(req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            let condition = { where :{id: req.params.id}}
            await User.update(req.body, condition)
            res.status(200).json(user);
        } else {
            res.status(404).send('Utilisateur non trouvé');
        }
    } catch (error) {
        console.error("Erreur de mise à jour :", error);
        res.status(500).send("Erreur serveur");
    }
});


// Creating a route to DELETE a user: DELETE method
router.delete("/:id", async(req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await User.destroy({ where :{id: req.params.id}});
            res.status(200).send('Utilisateur supprimé avec succès');
        } else {
            res.status(404).send('Utilisateur non trouvé');
        }
    } catch (error) {
        console.error("Erreur de suppression :", error);
        res.status(500).send("Erreur serveur");
    }
});


module.exports = router;