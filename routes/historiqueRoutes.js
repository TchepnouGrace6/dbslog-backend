const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/historiquecontroller');

// Ajouter une visionnage à l'historique
router.post('/historique', historiqueController.ajouterVisionnage);

// Obtenir l'historique d'un visiteur
router.get('/historique/:visiteur_id', historiqueController.getHistoriqueVisiteur);

module.exports = router;
