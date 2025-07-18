const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur DBSLog démarré sur le port http://localhost:${PORT}`);
});
/*const cors = require('cors');
app.use(cors({
  origin: '*', // pour développement
}));*/

