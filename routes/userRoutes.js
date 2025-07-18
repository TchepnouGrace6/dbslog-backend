const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { verifyToken, isAdmin } = require('../middlewares/authmiddleware');

router.post('/create', verifyToken, isAdmin, userController.createUser);
router.get('/affiche', verifyToken, isAdmin, userController.getAllUsers);
router.get('/:id', verifyToken, isAdmin, userController.getUserById);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
