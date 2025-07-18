const db = require('../configuration/db');

const EmissionChroniqueur = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO emission_chroniqueur (emission_id, chroniqueur_id, date_diffusion, rubrique)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [data.emission_id, data.chroniqueur_id, data.date_diffusion, data.rubrique], callback);
  },

  getAll: (callback) => {
    const sql = `SELECT * FROM emission_chroniqueur`;
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = `SELECT * FROM emission_chroniqueur WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE emission_chroniqueur
      SET emission_id = ?, chroniqueur_id = ?, date_diffusion = ?, rubrique = ?
      WHERE id = ?
    `;
    db.query(sql, [data.emission_id, data.chroniqueur_id, data.date_diffusion, data.rubrique, id], callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM emission_chroniqueur WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = EmissionChroniqueur;
