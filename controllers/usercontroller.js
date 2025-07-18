const Utilisateur = require('../models/utilisateurmodel');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { nom, email, password, role } = req.body;

  if (!nom || !email || !password || !role) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  if (!['presentateur', 'chroniqueur'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }

  Utilisateur.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    Utilisateur.create({ nom, email, password: hashedPassword, role }, (err2) => {
      if (err2) return res.status(500).json(err2);
      res.status(201).json({ message: 'Utilisateur créé avec succès' });
    });
  });
};

exports.getAllUsers = (req, res) => {
  Utilisateur.findAllInternes((err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  Utilisateur.findById(id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json(results[0]);
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { nom, email, role } = req.body;

  if (!['presentateur', 'chroniqueur'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }

  Utilisateur.update(id, { nom, email, role }, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json({ message: 'Utilisateur mis à jour' });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  Utilisateur.delete(id, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json({ message: 'Utilisateur supprimé' });
  });
};
