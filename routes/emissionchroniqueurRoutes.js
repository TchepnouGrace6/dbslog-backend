const express = require('express');
const router = express.Router();
const controller = require('../controllers/emissionchroniqueurcontroller');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Accessible uniquement par l’administrateur
router.post('/create-emission', verifyToken, isAdmin, controller.create);
router.post('/create-emission', verifyToken, isAdmin, controller.getAll);
router.get('/:id', verifyToken, isAdmin, controller.getById);
router.put('/:id', verifyToken, isAdmin, controller.update);
router.delete('/:id', verifyToken, isAdmin, controller.delete);

module.exports = router;
