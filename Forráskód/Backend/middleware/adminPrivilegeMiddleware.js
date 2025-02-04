// Ellenőrzi, hogy a bejelentkezett user admin-e.
const adminPrivilegeMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Nincs bejelentkezve.' });
  }

  // Feltételezzük, hogy a JWT-ben a user._id mellett tároljuk a role mezőt is,
  // például: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, ...)
  // vagy a middleware-ben külön lekérdezzük az adatbázisból a user-t.
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Hozzáférés megtagadva. Admin jogosultság szükséges.' });
  }

  next();
};

module.exports = adminPrivilegeMiddleware;
