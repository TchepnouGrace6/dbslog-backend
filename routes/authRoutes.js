const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

// Visiteur s'inscrit
router.post('/visiteur/register', authController.registerVisiteur);

// Visiteur se connecte
/*router.post('/visiteur/login', authController.loginVisiteur);

// Utilisateur interne se connecte
router.post('/utilisateur/login', authController.loginUtilisateur);*/
router.post('/login', authController.login);

module.exports = router;
