const db = require('../configuration/db');

const Historique = {
  add: (data, callback) => {
    const query = 'INSERT INTO historique (visiteur_id, emission_id) VALUES (?, ?)';
    db.query(query, [data.visiteur_id, data.emission_id], callback);
  },

  findByVisiteur: (visiteur_id, callback) => {
    const query = `
      SELECT h.id, h.date_visionnage, e.titre, e.description, e.date_diffusion, e.heure_debut, e.duree, e.type
      FROM historique h
      JOIN emission e ON h.emission_id = e.id
      WHERE h.visiteur_id = ?
      ORDER BY h.date_visionnage DESC
    `;
    db.query(query, [visiteur_id], callback);
  }
};

module.exports = Historique;
