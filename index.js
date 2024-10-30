const express = require("express")                  // Import du paquet express
const port = process.env.PORT || 5000
const sequelize = require('./config/database');     // Etablit une connexion à la BDD via l'ORM Sequelize
const Event = require('./models/event.js')

const app = express()                               // Ici appel de la fonction express pour démarrer notre serveur: création d'une application

// Création de routes
app.get("/", (req, res) =>{
    res.status(200).send("Hello World !")
})

app.get("/json", (req, res) => {
    res.status(200).json({
        id: 1,
        name: "Bob",
        age: 40,
        description: {
            cheveux: "blond",
            yeux: "bleu"
        },
        nationalité: "française"
    })
})

// Définit une route HTTP GET pour /databasetest
app.get("/databasetest", async(req, res) => {
    console.log("Testing database connection...");
    try {
        await sequelize.authenticate();      // Tente d'établir une connexion avec la base de données. Cela renvoie une promesse qui sera résolue si la connexion est réussie
        res.status(200).send("Connection has been established successfully.");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        res.status(500).send("Unable to connect to the database.");
    }
})


// Affichage des données de ma BDD (table events)
app.get("/events", async(req, res) => {
    try {
        const events = await Event.findAll();       // Récupère tous les évènements
        res.status(200).json(events);               // Retourne les évènements en json
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).send('Erreur serveur');
    }
});


// Démarrage du serveur et écoute d'un port donné
app.listen(port, () => {
    console.log(`Serveur en ligne ! A l'adresse: http://localhost:${port}`)
})