const express = require("express")      // Import du paquet express
const port = process.env.PORT || 5000
const sequelize = require('./config/database'); // Ajustez le chemin selon votre structure de dossiers

const app = express()       // Ici appel de la fonction express pour démarrer notre serveur: création d'une application

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

app.get("/databasetest", async(req, res) => {
    console.log("Testing database connection...");
    try {
        await sequelize.authenticate();
        res.status(200).send("Connection has been established successfully.");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        res.status(500).send("Unable to connect to the database.");
    }
})

// Démarrage du serveur et écoute d'un port donné
app.listen(port, () => {
    console.log(`Serveur en ligne ! A l'adresse: http://localhost:${port}`)
})