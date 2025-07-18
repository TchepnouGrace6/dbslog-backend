const Theme = require('../models/thememodel');
const db = require('../configuration/db');

// ✅ Création du thème par un présentateur
exports.create = (req, res) => {
  const { emission_id, date_diffusion, titre, description } = req.body;
  const userId = req.user.id; // Récupéré depuis le token

  // 🔍 Vérifie que l'utilisateur est le présentateur de l'émission
  const query = `SELECT * FROM emission WHERE id = ? AND presentateur_id = ?`;
  db.query(query, [emission_id, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });
    if (result.length === 0) {
      return res.status(403).json({ message: 'Vous n\'êtes pas le présentateur de cette émission.' });
    }
    // 2️⃣ Vérifie que ce thème n'existe pas déjà pour cette émission et cette date
    const checkDuplicateTheme = `
      SELECT * FROM theme
      WHERE emission_id = ? AND date_diffusion = ?
    `; 
    db.query(checkDuplicateTheme, [emission_id, date_diffusion], (err2, existingTheme) => {
        if (err2) return res.status(500).json({ message: 'Erreur lors de la vérification des doublons de thème.' });
        if (existingTheme.length > 0) {
             return res.status(400).json({ message: 'Un thème existe déjà pour cette émission à cette date.' });
        };

    Theme.create({ emission_id, date_diffusion, titre, description }, (err2, result2) => {
      if (err2) return res.status(500).json({ message: 'Erreur lors de la création du thème.' });
      res.status(201).json({ message: 'Thème créé avec succès.', id: result2.insertId });
    });
  });
});
};

exports.getAll = (req, res) => {
  Theme.getAll((err, themes) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la récupération des thèmes.' });
    res.status(200).json(themes);
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;
  Theme.getById(id, (err, theme) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la récupération du thème.' });
    if (theme.length === 0) return res.status(404).json({ message: 'Thème introuvable.' });
    res.status(200).json(theme[0]);
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { titre, description, date_diffusion } = req.body;

  Theme.update(id, { titre, description, date_diffusion }, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
    res.status(200).json({ message: 'Thème mis à jour avec succès.' });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Theme.delete(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la suppression.' });
    res.status(200).json({ message: 'Thème supprimé avec succès.' });
  });
};
