const Historique = require('../models/historiquemodel');

exports.ajouterVisionnage = (req, res) => {
  const { visiteur_id, emission_id } = req.body;

  if (!visiteur_id || !emission_id) {
    return res.status(400).json({ message: 'visiteur_id et emission_id sont requis.' });
  }

  Historique.add({ visiteur_id, emission_id }, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout à l\'historique :', err);
      return res.status(500).json({ message: 'Erreur serveur lors de l\'ajout à l\'historique.' });
    }
    res.status(201).json({ message: 'Visionnage enregistré avec succès.', id: result.insertId });
  });
};

exports.getHistoriqueVisiteur = (req, res) => {
  const { visiteur_id } = req.params;

  Historique.findByVisiteur(visiteur_id, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'historique :', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'historique.' });
    }
    res.status(200).json(results);
  });
};
