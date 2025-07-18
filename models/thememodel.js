const db = require('../configuration/db');

const Theme = {
  create: (data, callback) => {
    const sql = `INSERT INTO theme (emission_id, date_diffusion, titre, description)
                 VALUES (?, ?, ?, ?)`;
    db.query(sql, [data.emission_id, data.date_diffusion, data.titre, data.description], callback);
  },

  getAll: (callback) => {
    db.query('SELECT * FROM theme', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM theme WHERE id = ?', [id], callback);
  },

  update: (id, data, callback) => {
    const sql = `UPDATE theme SET titre = ?, description = ?, date_diffusion = ? WHERE id = ?`;
    db.query(sql, [data.titre, data.description, data.date_diffusion, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM theme WHERE id = ?', [id], callback);
  }
};

module.exports = Theme;
