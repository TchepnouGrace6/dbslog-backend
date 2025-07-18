const Emission = require('../models/emissionmodel');
const db = require('../configuration/db');

exports.createEmission = (req, res) => {
  const {
    titre,
    description,
    type,
    date_diffusion,
    heure_debut,
    duree,
    presentateur_id,
    video_url
  } = req.body;

  /// Champs obligatoires
  if (!titre || !type || !presentateur_id) {
    return res.status(400).json({ message: 'Le titre, le type et le présentateur sont requis.' });
  }
   // 1️⃣ Vérification de l'existence du présentateur
  const query1 = `SELECT * FROM utilisateur WHERE id = ? AND role = 'presentateur'`;
  db.query(query1, [presentateur_id], (err, presentateurResult) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la vérification du présentateur.' });
    }

    if (presentateurResult.length === 0) {
      return res.status(400).json({ message: 'Présentateur inexistant.' });
    }
    // 2️⃣ Vérification de conflit d'horaire
    const query2 = `
      SELECT * FROM emission
      WHERE presentateur_id = ? AND date_diffusion = ? AND heure_debut = ?
    `;
    db.query(query2, [presentateur_id, date_diffusion, heure_debut], (err2, emissionConflict) => {
      if (err2) {
        return res.status(500).json({ message: 'Erreur lors de la vérification du créneau horaire.' });
      }

      if (emissionConflict.length > 0) {
        return res.status(400).json({
          message: 'Ce présentateur a déjà une émission à cette date et heure.'
        });
      }
       // 3️⃣ Vérification de l'unicité du titre par présentateur
      const query3 = `
        SELECT * FROM emission
        WHERE titre = ? AND presentateur_id != ?
      `;
      db.query(query3, [titre, presentateur_id], (err3, existingEmission) => {
        if (err3) {
          return res.status(500).json({ message: 'Erreur lors de la vérification du titre d\'émission.' });
        }

        if (existingEmission.length > 0) {
          return res.status(400).json({
            message: 'Ce titre d\'émission est déjà attribué à un autre présentateur.'
          });
        }
    const data = {
    titre,
    description: description || null,
    type,
    date_diffusion: date_diffusion || null,
    heure_debut: heure_debut || null,
    duree: duree || null,
    presentateur_id: presentateur_id || null,
    video_url: video_url || null,
  };

  Emission.create(data, (err4, result) => {
          if (err4) {
            console.error('Erreur lors de la création de l\'émission :', err4);
            return res.status(500).json({ message: 'Erreur serveur lors de la création de l\'émission.' });
          }

          res.status(201).json({
            message: 'Émission créée avec succès.',
            id: result.insertId
          });
        });
      });
    });
  });
};

exports.getAllEmissions = (req, res) => {
  Emission.findAll((err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des émissions :', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des émissions.' });
    }
    res.status(200).json(results);
  });
};

exports.getEmissionById = (req, res) => {
  const { id } = req.params;
  Emission.findById(id, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'émission :', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération de l\'émission.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Émission non trouvée.' });
    }
    res.status(200).json(results[0]);
  });
};

exports.updateEmission = (req, res) => {
  const { id } = req.params;
  const {
    titre,
    description,
    type,
    date_diffusion,
    heure_debut,
    duree,
    presentateur_id,
    video_url
  } = req.body;

  const data = {
    titre,
    description: description || null,
    type,
    date_diffusion: date_diffusion || null,
    heure_debut: heure_debut || null,
    duree: duree || null,
    presentateur_id: presentateur_id || null,
    video_url : video_url || null,
  };

  Emission.update(id, data, (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l\'émission :', err);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'émission.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Émission non trouvée.' });
    }
    res.status(200).json({ message: 'Émission mise à jour avec succès.' });
  });
};

exports.deleteEmission = (req, res) => {
  const { id } = req.params;
  Emission.delete(id, (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'émission :', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression de l\'émission.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Émission non trouvée.' });
    }
    res.status(200).json({ message: 'Émission supprimée avec succès.' });
  });
};
