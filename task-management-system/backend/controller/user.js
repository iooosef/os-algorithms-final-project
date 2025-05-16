const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', (req, res) => {
        const user_id = req.query.id;

        // with query params: id
        if (user_id) {
            db.get(`SELECT user_id AS id, username, email, role FROM Users WHERE user_id = ? LIMIT 1`, [user_id], (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(user || {});
            });
        } 
        // no query param
        else {
            db.all(`SELECT user_id AS id, username, email, role FROM Users`, (err, users) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(users || []);
            });
        }
    });

    return router;
}