const EmissionChroniqueur = require('../models/emissionchroniqueurmodel');
const db = require('../configuration/db');

exports.create = (req, res) => {
  const { emission_id, chroniqueur_id, date_diffusion, rubrique } = req.body;

  if (!emission_id || !chroniqueur_id || !date_diffusion || !rubrique) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  // Étape 1️⃣ : Vérifier que le chroniqueur existe
  const checkChroniqueur = `SELECT * FROM utilisateur WHERE id = ? AND role = 'chroniqueur'`;
  db.query(checkChroniqueur, [chroniqueur_id], (err1, result1) => {
    if (err1) return res.status(500).json({ message: 'Erreur vérification chroniqueur.', error: err1 });
    if (result1.length === 0) return res.status(404).json({ message: 'Chroniqueur introuvable.' });

    // Étape 2️⃣ : Vérifier que l’émission existe
    const checkEmission = `SELECT * FROM emission WHERE id = ?`;
    db.query(checkEmission, [emission_id], (err2, result2) => {
      if (err2) return res.status(500).json({ message: 'Erreur vérification émission.', error: err2 });
      if (result2.length === 0) return res.status(404).json({ message: 'Émission introuvable.' });

      const heure_debut = result2[0].heure_debut;

      // Étape 3️⃣ : Vérifier que le chroniqueur n’a pas une autre émission au même moment
      const checkDoubleHoraire = `
        SELECT ec.*
        FROM emission_chroniqueur ec
        JOIN emission e ON ec.emission_id = e.id
        WHERE ec.chroniqueur_id = ? AND ec.date_diffusion = ? AND e.heure_debut = ?
      `;
      db.query(checkDoubleHoraire, [chroniqueur_id, date_diffusion, heure_debut], (err3, result3) => {
        if (err3) return res.status(500).json({ message: 'Erreur conflit horaire.', error: err3 });
        if (result3.length > 0) {
          return res.status(400).json({ message: 'Ce chroniqueur est déjà programmé à cette heure.' });
        }

        // Étape 4️⃣ : Vérifier qu’aucun autre chroniqueur n’a la même rubrique ce jour-là dans cette émission
        const checkRubriqueUnique = `
          SELECT * FROM emission_chroniqueur
          WHERE emission_id = ? AND date_diffusion = ? AND rubrique = ?
        `;
        db.query(checkRubriqueUnique, [emission_id, date_diffusion, rubrique], (err4, result4) => {
          if (err4) return res.status(500).json({ message: 'Erreur vérification rubrique.', error: err4 });
          if (result4.length > 0) {
            return res.status(400).json({ message: 'Cette rubrique est déjà attribuée à un autre chroniqueur pour cette émission.' });
          }

          // ✅ Si tout est bon, on crée l’affectation
          EmissionChroniqueur.create(
            { emission_id, chroniqueur_id, date_diffusion, rubrique },
            (err5, result5) => {
              if (err5) return res.status(500).json({ message: 'Erreur lors de l\'attribution.', error: err5 });
              res.status(201).json({ message: 'Chroniqueur attribué à l\'émission avec succès.', id: result5.insertId });
            }
          );
        });
      });
    });
  });
};


exports.getAll = (req, res) => {
  EmissionChroniqueur.getAll((err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.status(200).json(rows);
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;
  EmissionChroniqueur.getById(id, (err, row) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (row.length === 0) return res.status(404).json({ message: 'Affectation introuvable.' });
    res.status(200).json(row[0]);
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { emission_id, chroniqueur_id, date_diffusion, rubrique } = req.body;

  EmissionChroniqueur.update(id, { emission_id, chroniqueur_id, date_diffusion, rubrique }, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.status(200).json({ message: 'Affectation mise à jour.' });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  EmissionChroniqueur.delete(id, (err) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.status(200).json({ message: 'Affectation supprimée.' });
  });
};
