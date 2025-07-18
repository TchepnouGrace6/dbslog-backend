const db = require('../configuration/db');

// 📅 Grille du jour complète
exports.getGrilleDuJourComplet = (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const sql = `
   SELECT 
  e.id AS emission_id,
  e.titre AS emission_titre,
  e.date_diffusion,
  e.heure_debut,
  e.duree,
  e.type,
  p.nom AS presentateur_nom,
  t.titre AS theme_titre,
  c.id AS chroniqueur_id,
  c.nom AS chroniqueur_nom,
  ec.rubrique AS chroniqueur_rubrique
FROM emission e
JOIN utilisateur p ON e.presentateur_id = p.id
LEFT JOIN theme t ON e.id = t.emission_id AND t.date_diffusion = ?
LEFT JOIN emission_chroniqueur ec ON e.id = ec.emission_id 
LEFT JOIN utilisateur c ON ec.chroniqueur_id = c.id
WHERE e.date_diffusion = ?
ORDER BY e.heure_debut ASC

  `;

  db.query(sql, [today, today], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const emissions = {};

    rows.forEach(row => {
      if (!emissions[row.emission_id]) {
        emissions[row.emission_id] = {
          titre: row.emission_titre,
          date: row.date_diffusion,
          heure: row.heure_debut,
          duree: row.duree,
          type: row.type,
          theme: row.theme_titre,
          presentateur: row.presentateur_nom,
          chroniqueurs: {},
        };
      }

      if (row.chroniqueur_id) {
        const chroniqueurs = emissions[row.emission_id].chroniqueurs;

        if (!chroniqueurs[row.chroniqueur_id]) {
          chroniqueurs[row.chroniqueur_id] = {
            nom: row.chroniqueur_nom,
            rubriques: row.chroniqueur_rubrique ? [row.chroniqueur_rubrique] : []

          };
        }

        if (row.rubrique && !chroniqueurs[row.chroniqueur_id].rubriques.includes(row.rubrique)) {
          chroniqueurs[row.chroniqueur_id].rubriques.push(row.rubrique);
        }
      }
    });

    const result = Object.values(emissions).map(em => {
      em.chroniqueurs = Object.values(em.chroniqueurs);
      return em;
    });

    res.json(result);
  });
};

// 📅 Grille de la semaine complète
exports.getGrilleSemaineComplet = (req, res) => {
  const sql = `
    SELECT 
  e.id AS emission_id,
  e.titre AS emission_titre,
  e.date_diffusion,
  e.heure_debut,
  e.duree,
  e.type,
  p.nom AS presentateur_nom,
  t.titre AS theme_titre,
  c.id AS chroniqueur_id,
  c.nom AS chroniqueur_nom,
  ec.rubrique AS chroniqueur_rubrique
    FROM emission e
    JOIN utilisateur p ON e.presentateur_id = p.id
    LEFT JOIN theme t ON e.id = t.emission_id AND WEEK(t.date_diffusion) = WEEK(CURDATE())
    LEFT JOIN emission_chroniqueur ec ON e.id = ec.emission_id 
    LEFT JOIN utilisateur c ON ec.chroniqueur_id = c.id
    WHERE WEEK(e.date_diffusion) = WEEK(CURDATE())
    ORDER BY e.date_diffusion ASC, e.heure_debut ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const emissions = {};

    rows.forEach(row => {
      if (!emissions[row.emission_id]) {
        emissions[row.emission_id] = {
          titre: row.emission_titre,
          date: row.date_diffusion,
          heure: row.heure_debut,
          duree: row.duree,
          type: row.type,
          theme: row.theme_titre,
          presentateur: row.presentateur_nom,
          chroniqueurs: {},
        };
      }

      if (row.chroniqueur_id) {
        const chroniqueurs = emissions[row.emission_id].chroniqueurs;

        if (!chroniqueurs[row.chroniqueur_id]) {
          chroniqueurs[row.chroniqueur_id] = {
            nom: row.chroniqueur_nom,
           rubriques: row.chroniqueur_rubrique ? [row.chroniqueur_rubrique] : []
          };
        }

        if (row.rubrique && !chroniqueurs[row.chroniqueur_id].rubriques.includes(row.rubrique)) {
          chroniqueurs[row.chroniqueur_id].rubriques.push(row.rubrique);
        }
      }
    });

    const result = Object.values(emissions).map(em => {
      em.chroniqueurs = Object.values(em.chroniqueurs);
      return em;
    });

    res.json(result);
  });
};
