const express = require('express');
const router = express.Router();
const emissionController = require('../controllers/emissioncontroller');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Routes CRUD accessibles uniquement à l'administrateur
router.post('/createemission', verifyToken, isAdmin, emissionController.createEmission);
router.get('/afficheemission', verifyToken, isAdmin, emissionController.getAllEmissions);
router.get('/:id', verifyToken, isAdmin, emissionController.getEmissionById);
router.put('/:id', verifyToken, isAdmin, emissionController.updateEmission);
router.delete('/:id', verifyToken, isAdmin, emissionController.deleteEmission);

module.exports = router;
