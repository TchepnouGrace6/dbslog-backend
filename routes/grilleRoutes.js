const express = require('express');
const router = express.Router();
const grilleController = require('../controllers/grillecontroller');

router.get('/jour', grilleController.getGrilleDuJourComplet);
router.get('/semaine', grilleController.getGrilleSemaineComplet);

module.exports = router;
