const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', (req, res) => {
        const project_id = req.query.id;

        // with query params: id
        if (project_id) {
            db.get(`SELECT * FROM Projects WHERE project_id = ? LIMIT 1`, [project_id], (err, project) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(project || {});
            });
        } 
        // no query param = GET ALL
        else {
            db.all(`SELECT * FROM Projects`, (err, projects) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(projects || {}); 
            });
        }
    });

    router.post('/', (req, res) => {
        const { name, description } = req.body;
        const created_by = req.session?.user?.id;
        console.log("session", req.session)
        if (!created_by) return res.status(401).json({ error: 'Unauthorized: No user in session' });

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

    router.put('/', (req, res) => {
        const { name, description, project_id } = req.body;
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:mm:SS"

        if (!project_id) return res.status(400).json({ error: 'project_id is required' });
        if (!name) return res.status(400).json({ error: 'Project name is required' });

        const query = `
            UPDATE Projects
            SET name = ?, description = ?, updated_at = ?
            WHERE project_id = ?
        `;

        db.run(query, [name, description, updated_at, project_id], function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }

            res.status(200).json({ message: 'Project updated' });
        });
    });



    return router;
}