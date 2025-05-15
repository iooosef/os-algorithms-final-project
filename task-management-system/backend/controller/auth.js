const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = (db) => {
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(401).json({ error: 'Invalid username or password' });

      bcrypt.compare(password, user.password_hash, (err, valid) => {
        if (err) return res.status(500).json({ error: 'Error checking password' });
        if (!valid) return res.status(401).json({ error: 'Invalid username or password' });

        req.session.user = { id: user.user_id, username: user.username, role: user.role };
        res.json({ message: 'Login successful' });
      });
    });
  });

  return router;
};
