const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/assigned-to', (req, res) => {
        const assigned_to_id = req.query.id;
        if (!assigned_to_id) return res.status(400).json({ error: 'Missing id' });

        db.all(`SELECT * FROM Tickets WHERE assigned_to = ? AND status <> 'Completed'
                ORDER BY priority, due_date`, [assigned_to_id], (err, ticket) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(ticket || {}); // Return empty object if no ticket found
        });
    });

    router.get('/', (req, res) => {
        const tix_id = parseInt(req.query.id);
        if (!tix_id) return res.status(400).json({ error: 'Missing id' });

        db.get(`SELECT * FROM Tickets WHERE ticket_id = ?`, [tix_id], (err, tix) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(tix || {}); // Return empty object if no ticket found
        });
    })

    return router;
}