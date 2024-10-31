const express = require("express")                  // Import du paquet express
const port = process.env.PORT || 5000
const sequelize = require('./config/database');     // Etablit une connexion à la BDD via l'ORM Sequelize
const Event = require('./models/event.js')
const User = require('./models/user.js')

const app = express()                               // Ici appel de la fonction express pour démarrer notre serveur: création d'une application

// Middleware pour lire les requêtes json
app.use(express.json())

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


// Récupération et affichage des données de la table "events" de ma BDD
app.get("/events", async(req, res) => {
    try {
        const events = await Event.findAll();       // Récupère tous les évènements
        res.status(200).json(events);               // Retourne les évènements en json
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).send('Erreur serveur');
    }
});

// Récupération et affichage des données de la table "users" de ma BDD
app.get("/users", async(req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des users:', error);
    res.status(500).send('Erreur serveur');
    }
})


// Récupération et affichage d'un seul event en fonction de son id
app.get("/events/:id", async(req, res) => {
    try {
        const id = req.params.id
        const event = await Event.findByPk(id);
        res.status(200).json(event);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'événement:", error);
        res.status(500).send('Erreur serveur');
    }
})

// Récupération et affichage d'un seul user en fonction de son id
app.get("/users/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        res.status(200).json(user)
    } catch (error) {
        console.error('Erreur lors de la récupération du user:', error);
        res.status(500).send('Erreur serveur');
    }
})


// Création d'une route pour AJOUTER (création) des nouveaux évènements: méthode POST
app.post('/events', async(req, res) => {
    try {
        const { name, date, schedules, comment } = req.body;   // Données envoyées dans le corps de la requête
        const newEvent = await Event.create({ name, date, schedules, comment })
        res.status(201).json(newEvent)
    } catch (error) {
        console.error("Erreur de création :", error);
        res.status(500).send("Erreur serveur");
    }
})

// Création d'une route pour AJOUTER (création) des nouveaux utilisateurs: méthode POST
app.post('/users', async(req,res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser)
    } catch (error) {
        console.error("Erreur de création :", error);
        res.status(500).send("Erreur serveur");
    }
})


// Création d'une route pour METTRE A JOUR (modifier) un évènement: méthode PUT (met tout à jour) - méthode patch (ne met à jour que certains champs)
app.put('/events/:id', async(req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);      // Trouve l'évènement par son id
        if (event) {
            let condition = { where :{id: req.params.id} };     // where précise à Sequelize les entrées de la table events à mettre à jour (ici, seule l'entrée dont l'id correspond (req.params.id) sera mise à jour)
            await Event.update(req.body, condition);            // Mise à jour des données
            res.status(200).json(event);
        } else {
            res.status(404).send('Evènement non trouvé');
        }
    } catch (error) {
        console.error("Erreur de mise à jour :", error);
        res.status(500).send("Erreur serveur");
    }
})

// Création d'une route pour METTRE A JOUR (modifier) un user: méthode PUT
app.put("/users/:id", async(req, res) => {
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
})


// Création d'une route pour SUPPRIMER un évènement: méthode DELETE
app.delete("/events/:id", async(req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);              // Recherche l'événement par ID
        if (event) {
            await Event.destroy({ where :{id: req.params.id}})          // Supprime l'événement dont l'ID correspond à req.params.id (si trouvé)

            res.status(200).send('Evènement supprimé avec succés')
        } else {
            res.status(404).send('Evènement non trouvé')
        }
    } catch (error) {
        console.error("Erreur de suppression :", error);
        res.status(500).send("Erreur serveur");
    }
});


// Démarrage du serveur et écoute d'un port donné
app.listen(port, () => {
    console.log(`Serveur en ligne ! A l'adresse: http://localhost:${port}`)
    sequelize.sync({ alter: true })
    .then(() => console.log("Toutes les tables sont synchronisées"))
    .catch((error) => console.error("Erreur de synchronisation:", error));

})