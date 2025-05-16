const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', (req, res) => {
        db.all(`SELECT * FROM Projects`, (err, projects) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(projects || {}); 
        });
    });

    return router;
}