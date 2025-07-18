const db = require('../configuration/db');

const Utilisateur = {
  create: (data, callback) => {
    const { nom, email, password, role } = data;
    const sql = 'INSERT INTO utilisateur (nom, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, email, password, role], callback);
  },

  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM utilisateur WHERE email = ?';
    db.query(sql, [email], callback);
  },

  findAllInternes: (callback) => {
    const sql = "SELECT id, nom, email, role FROM utilisateur WHERE role IN ('presentateur', 'chroniqueur')";
    db.query(sql, callback);
  },

  findById: (id, callback) => {
    const sql = "SELECT id, nom, email, role FROM utilisateur WHERE id = ? AND role IN ('presentateur', 'chroniqueur')";
    db.query(sql, [id], callback);
  },

  update: (id, data, callback) => {
    const { nom, email, role } = data;
    const sql = 'UPDATE utilisateur SET nom = ?, email = ?, role = ? WHERE id = ? AND role IN ("presentateur", "chroniqueur")';
    db.query(sql, [nom, email, role, id], callback);
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM utilisateur WHERE id = ? AND role IN ("presentateur", "chroniqueur")';
    db.query(sql, [id], callback);
  },

  findByIdRaw: (id, callback) => {
    // Pour récupérer tout l'utilisateur sans filtre de rôle (optionnel)
    const sql = 'SELECT * FROM utilisateur WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Utilisateur;
