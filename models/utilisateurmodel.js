const db = require('../configuration/db');

const Utilisateur = {
  create: (data, callback) => {
    const sql = 'INSERT INTO utilisateur (nom, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [data.nom, data.email, data.password, data.role], callback);
  },

  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM utilisateur WHERE email = ?';
    db.query(sql, [email], callback);
  }
  // Ajoute d’autres méthodes si besoin
};

module.exports = Utilisateur;
