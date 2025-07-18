const express = require('express');
const router = express.Router();
const visiteurController = require('../controllers/visiteurcontroller');

router.get('/emissions/recherche', visiteurController.rechercherEmissions);

module.exports = router;
