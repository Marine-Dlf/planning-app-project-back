const express = require("express");                 // express package import
const port = process.env.PORT || 5000;
const sequelize = require('./config/database');     // Establishes a connection to the BDD via the Sequelize ORM
const cors = require('cors');
const usersRoutes = require('./routes/usersRoutes.js');
const eventsRoutes = require('./routes/eventsRoutes.js');
const typesRoutes = require('./routes/typesRoutes.js');


const app = express();      // Call the express function to start our server: creating an application
app.use(express.json());    // Middleware to read json requests
app.use(cors());            // Allows requests from other domains


// Routes
app.use("/events", eventsRoutes);
app.use("/types", typesRoutes);
app.use("/users", usersRoutes);


// Starting the server and listening on a specific port
app.listen(port, () => {
    console.log(`Serveur en ligne ! A l'adresse: http://localhost:${port}`)
    sequelize.sync({ alter: true })
    .then(() => console.log("Toutes les tables sont synchronisées"))
    .catch((error) => console.error("Erreur de synchronisation:", error));

});