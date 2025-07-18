const express = require('express');
const router = express.Router();
const controller = require('../controllers/themecontroller');
const { verifyToken } = require('../middlewares/authmiddleware');

router.post('/create-theme', verifyToken, controller.create);
router.get('/affiche-theme', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', verifyToken, controller.update);
router.delete('/:id', verifyToken, controller.delete);

module.exports = router;
