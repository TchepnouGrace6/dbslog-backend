const app = require('./app');
const PORT = process.env.PORT || 3000;

// Écouter sur toutes les interfaces réseau (nécessaire pour Flutter Chrome)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur DBSLog démarré sur http://0.0.0.0:${PORT}`);
});
