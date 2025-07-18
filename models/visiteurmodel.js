const db = require('../configuration/db');

const Visiteur = {
  create: (data, callback) => {
    const sql = 'INSERT INTO visiteur (nom, email, ville, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [data.nom, data.email, data.ville, data.password], callback);
  },

  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM visiteur WHERE email = ?';
    db.query(sql, [email], callback);
  }
};

module.exports = Visiteur;
