const jwt = require('jsonwebtoken');

// Clé secrète pour JWT (à mettre dans .env idéalement)
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clef_secrete';

// Middleware pour vérifier que le token est valide
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1]; // Format "Bearer TOKEN"
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user; // on stocke les infos du user dans la requête
    next();
  });
}

// Middleware pour vérifier que l'utilisateur est admin
function isAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

  if (req.user.role !== 'administrateur') {
    return res.status(403).json({ message: 'Accès refusé : admin uniquement' });
  }

  next();
}

module.exports = { verifyToken, isAdmin };
