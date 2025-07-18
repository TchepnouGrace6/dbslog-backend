const db = require('../configuration/db');

exports.rechercherEmissions = (req, res) => {
  const { titre, presentateur, theme } = req.query;
  let query = `
    SELECT e.*, u.nom AS nom_presentateur, t.titre
    FROM emission e
    LEFT JOIN utilisateur u ON e.presentateur_id = u.id
    LEFT JOIN theme t ON t.emission_id = e.id
    WHERE 1 = 1
  `;
  const values = [];

  if (titre) {
    query += ` AND e.titre LIKE ?`;
    values.push(`%${titre}%`);
  }

  if (presentateur) {
    query += ` AND u.nom LIKE ?`;
    values.push(`%${presentateur}%`);
  }

  if (theme) {
    query += ` AND t.titre LIKE ?`;
    values.push(`%${theme}%`);
  }

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
