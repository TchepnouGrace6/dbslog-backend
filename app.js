const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes auth
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const emissionRoutes = require('./routes/emissionRoutes');
app.use('/api/emissions', emissionRoutes);

const emissionChroniqueurRoutes = require('./routes/emissionchroniqueurRoutes');
app.use('/api/emission-chroniqueur', emissionChroniqueurRoutes);

const themeRoutes = require('./routes/themeRoutes');
app.use('/api/themes', themeRoutes);

const grilleRoutes = require('./routes/grilleRoutes');
app.use('/api/grille', grilleRoutes);

const visiteurRoutes = require('./routes/visiteurRoutes');
app.use('/api/visiteur', visiteurRoutes);

const historiqueRoutes = require('./routes/historiqueRoutes');
app.use('/api', historiqueRoutes);

/*const setupRoutes = require('./routes/setupRoutes');
app.use('/api/setup', setupRoutes);*/

// Exemple de route test
app.get('/', (req, res) => {
  res.send('API DBSLog opérationnelle');
});

module.exports = app;
