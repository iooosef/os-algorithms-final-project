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

    router.post('/register', (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        db.get(`SELECT * FROM Users WHERE username = ? OR email = ?`, [username, email], (err, existingUser) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            if (existingUser) {
            return res.status(409).json({ error: 'Username or email already in use' });
            }

            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) return res.status(500).json({ error: 'Error hashing password' });

            db.run(
                `INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
                [username, email, hash, 'user'],
                (err) => {
                if (err) return res.status(500).json({ error: 'Error inserting user' });

                res.status(201).json({ message: 'User registered successfully' });
                }
            );
            });
        });
    });


  return router;
};
