const isPractitioner = async (req, res, next) => {
  if (req.user.role !== 'practitioner') {
    return res.status(403).json({ message: 'Access denied. Practitioners only.' });
  }
  next();
};

module.exports = { isPractitioner };
