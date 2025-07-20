const db = require('../configuration/db');

const Emission = {
  create: (data, callback) => {
    const { titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, categorie } = data;
    const sql = `
      INSERT INTO emission (titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, categorie)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, categorie], callback);
  },

  findAll: (callback) => {
    const sql = `
      SELECT e.*, u.nom AS nom_presentateur
      FROM emission e
      LEFT JOIN utilisateur u ON e.presentateur_id = u.id
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
    const { titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, categorie } = data;
    const sql = `
      UPDATE emission SET
      titre = ?, description = ?, type = ?, date_diffusion = ?, heure_debut = ?, duree = ?, presentateur_id = ?, video_url=?, categorie = ?
      WHERE id = ?
    `;
    db.query(sql, [titre, description, type, date_diffusion, heure_debut, duree, presentateur_id, video_url, categorie, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM emission WHERE id = ?', [id], callback);
  }
};

module.exports = Emission;
