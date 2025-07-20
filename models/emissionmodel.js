const db = require('../configuration/db');

const Emission = {
  create: (data, callback) => {
    const { titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, id_categorie } = data;
    const sql = `
      INSERT INTO emission (titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, id_categorie)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, id_categorie], callback);
  },

  findAll: (callback) => {
    const sql = `
      SELECT e.*, u.nom AS nom_presentateur,c.nom AS categorie
      FROM emission e
      LEFT JOIN utilisateur u ON e.presentateur_id = u.id
       LEFT JOIN categorie_emission c ON e.id_categorie = c.id
    `;
    db.query(sql, callback);
  },

  findById: (id, callback) => {
    const sql = `
      SELECT e.*, u.nom AS nom_presentateur
      FROM emission e
      LEFT JOIN utilisateur u ON e.presentateur_id = u.id
      WHERE e.id = ?
    `;
    db.query(sql, [id], callback);
  },


  update: (id, data, callback) => {
    const { titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, id_categorie } = data;
    const sql = `
      UPDATE emission SET
      titre = ?, description = ?, type = ?, date_diffusion = ?, heure_debut = ?, duree = ?, presentateur_id = ?, video_url=?, id_categorie = ?
      WHERE id = ?
    `;
    db.query(sql, [titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, id_categorie, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM emission WHERE id = ?', [id], callback);
  }
};

module.exports = Emission;
