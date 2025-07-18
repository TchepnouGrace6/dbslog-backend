const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../configuration/db');

// Route de création d’un admin (à utiliser une seule fois)
router.post('/admin', async (req, res) => {
  const { nom, email, password } = req.body;

  if (!nom || !email || !password) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  // Vérifier s’il existe déjà
  db.query('SELECT * FROM utilisateur WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) {
      return res.status(400).json({ message: 'Admin déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO utilisateur (nom, email, password, role) VALUES (?, ?, ?, ?)',
      [nom, email, hashedPassword, 'administrateur'],
      (err2) => {
        if (err2) return res.status(500).json(err2);
        res.status(201).json({ message: 'Administrateur créé avec succès' });
      }
    );
  });
});

module.exports = router;
