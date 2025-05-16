const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', (req, res) => {
        db.all(`SELECT * FROM Projects`, (err, projects) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(projects || {}); 
        });
    });

    router.post('/', (req, res) => {
        const { name, description } = req.body;
        const created_by = req.session.user.user_id;

        if (!name) return res.status(400).json({ error: 'Project name is required' });

        const query = `
            INSERT INTO Projects (name, description, created_by)
            VALUES (?, ?, ?)
        `;

        db.run(query, [name, description, created_by], function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            res.status(201).json({ message: 'Project created', project_id: this.lastID });
        });
    });


    return router;
}