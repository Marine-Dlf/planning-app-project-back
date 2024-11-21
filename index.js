const express = require("express")                  // express package import
const port = process.env.PORT || 5000
const sequelize = require('./config/database');     // Establishes a connection to the BDD via the Sequelize ORM
// const Event = require('./models/event.js')
const User = require('./models/user.js')
const cors = require('cors');
const { Event, Type } = require('./models/associations');


const app = express()                               // Call the express function to start our server: creating an application

// Middleware to read json requests
app.use(express.json())

app.use(cors());

// Creating roads
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

// Defines an HTTP GET route for /databasetest
app.get("/databasetest", async(req, res) => {
    console.log("Testing database connection...");
    try {
        await sequelize.authenticate();      // Attempts to establish a connection to the database. This returns a promise that will be resolved if the connection is successful.
        res.status(200).send("Connection has been established successfully.");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        res.status(500).send("Unable to connect to the database.");
    }
})


// Retrieving and displaying data from the "events" table in my database
app.get("/events", async(req, res) => {
    try {
        const events = await Event.findAll();       // Get all events
        res.status(200).json(events);               // Returns events in json
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route GET pour récupérer tous les types
app.get('/types', async (req, res) => {
    try {
        const types = await Type.findAll();  // Récupérer tous les types
        res.status(200).json(types);         // Retourner la liste des types
    } catch (error) {
        console.error('Erreur lors de la récupération des types:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// Retrieving and displaying data from the "users" table in my database
app.get("/users", async(req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des users:', error);
        res.status(500).send('Erreur serveur');
    }
})


// Retrieving and displaying a single event based on their ID
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

// Retrieving and displaying a single user based on their ID
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


// Creating a route to add (CREATE) new events: POST method
app.post('/events', async(req, res) => {
    const { eventName, date, time, location, comment, types_id } = req.body         // Data sent in the body of the request

    // Vérifie si eventName est vide
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
})

// Creating a route to add (CREATE) new types: POST method
app.post('/types', async(req, res) => {

    const { typeName } = req.body

    // Vérifie si eventName est vide
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
})

// Creating a route to add (CREATE) new users: POST method
app.post('/users', async(req,res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser)
    } catch (error) {
        console.error("Erreur de création :", error);
        res.status(500).send("Erreur serveur");
    }
})


// Creating a route to UPDATE (modify) an event: PUT method (updates everything) - patch method (updates only certain fields)
app.put('/events/:id', async(req, res) => {
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
})

// Creating a route to UPDATE (modify) a user: PUT method
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


// Creating a route to DELETE an event: DELETE method
app.delete("/events/:id", async(req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);              // Search event by ID
        if (event) {
            await Event.destroy({ where :{id: req.params.id}})          // Delete the event whose ID matches req.params.id (if found)
            res.status(200).json('Evènement supprimé avec succès')
        } else {
            res.status(404).send('Evènement non trouvé')
        }
    } catch (error) {
        console.error("Erreur de suppression :", error);
        res.status(500).send("Erreur serveur");
    }
});

// Creating a route to DELETE a user: DELETE method
app.delete("/users/:id", async(req, res) => {
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


// Starting the server and listening on a specific port
app.listen(port, () => {
    console.log(`Serveur en ligne ! A l'adresse: http://localhost:${port}`)
    sequelize.sync({ alter: true })
    .then(() => console.log("Toutes les tables sont synchronisées"))
    .catch((error) => console.error("Erreur de synchronisation:", error));

})