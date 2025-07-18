const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateurmodel');
const Visiteur = require('../models/visiteurmodel');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Inscription visiteur
exports.registerVisiteur = (req, res) => {
  const { nom, email, ville, password } = req.body;
  if (!email || !ville || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }
  Visiteur.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json(err);
      Visiteur.create({ nom, email, ville, password: hash }, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Inscription réussie' });
      });
    });
  });
};
/*
// Connexion visiteur
exports.loginVisiteur = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }
  Visiteur.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }
    const visiteur = results[0];
    bcrypt.compare(password, visiteur.password, (err, isMatch) => {
      if (err) return res.status(500).json(err);
      if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

      const token = jwt.sign({ id: visiteur.id, role: 'visiteur' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, visiteur: { id: visiteur.id, nom: visiteur.nom, email: visiteur.email } });
    });
  });
};

// Connexion utilisateur interne (admin, présentateur, chroniqueur)
exports.loginUtilisateur = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Email ou mot de passe manquant");
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }
  Utilisateur.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      console.log("Utilisateur non trouvé avec cet email");
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json(err);
      console.log("Mot de passe incorrect");
      if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      console.log("Connexion réussie :", user.email);
      res.json({ token, utilisateur: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
    });
  });
};*/
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email et mot de passe requis" });

  Utilisateur.findByEmail(email, (err, utilisateurs) => {
    if (err) return res.status(500).json(err);

    if (utilisateurs.length > 0) {
      const user = utilisateurs[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json(err);
        if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
        return res.json({ token, utilisateur: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
      });
    } else {
      // Si pas trouvé dans utilisateur, on cherche dans visiteur
      Visiteur.findByEmail(email, (err, visiteurs) => {
        if (err) return res.status(500).json(err);
        if (visiteurs.length === 0) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        const visiteur = visiteurs[0];
        bcrypt.compare(password, visiteur.password, (err, isMatch) => {
          if (err) return res.status(500).json(err);
          if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

          const token = jwt.sign({ id: visiteur.id, role: "visiteur" }, JWT_SECRET, { expiresIn: "24h" });
          return res.json({ token, visiteur: { id: visiteur.id, nom: visiteur.nom, email: visiteur.email } });
        });
      });
    }
  });
};

