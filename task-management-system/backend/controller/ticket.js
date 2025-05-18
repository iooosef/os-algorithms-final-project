const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/assigned-by', (req, res) => {
        const created_by_id = req.query.id;
        if (!created_by_id) return res.status(400).json({ error: 'Missing id' });

        db.all(`SELECT * FROM Tickets WHERE created_by = ? AND status <> 'Completed'
                ORDER BY priority, due_date`, [created_by_id], (err, ticket) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(ticket || {}); // Return empty object if no ticket found
        });
    });

    router.get('/assigned-to', (req, res) => {
        const assigned_to_id = req.query.id;
        if (!assigned_to_id) return res.status(400).json({ error: 'Missing id' });

        db.all(`SELECT * FROM Tickets WHERE assigned_to = ? AND status <> 'Completed'
                ORDER BY priority, due_date`, [assigned_to_id], (err, ticket) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(ticket || {}); // Return empty object if no ticket found
        });
    });

    router.get('/assigned-to-all', (req, res) => {
        const assigned_to_id = req.query.id;
        if (!assigned_to_id) return res.status(400).json({ error: 'Missing id' });

        db.all(`SELECT * FROM Tickets WHERE assigned_to = ?
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

    router.post('/', (req, res) => {
        const { project_id, title, description, priority, assigned_to, due_date } = req.body;
        const created_by = req.session?.user?.id;
        let modelStateErrors = [];
        if (!created_by) return res.status(401).json({ error: 'Unauthorized: No user in session' });
        if (!project_id) modelStateErrors.push('Project is required');
        if (!title) modelStateErrors.push('Title is required');
        if (!description) modelStateErrors.push('Description is required');
        if (priority === undefined || priority === null) modelStateErrors.push('Priority is required');
        if (!assigned_to) modelStateErrors.push('User assignment is required');
        if (!due_date) modelStateErrors.push('Due date is required');
        if (modelStateErrors.length > 0) return res.status(400).json({ errors: modelStateErrors });

        const runInsert = () => {
            const status = priority === 0 ? 'In Progress' : 'Queued';
            const query = `
                INSERT INTO Tickets (project_id, title, description, priority, status, created_by, assigned_to, due_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(query, [project_id, title, description, priority, status, created_by, assigned_to, due_date], function (err) {
                if (err) return res.status(500).json({ error: 'Database error' });

                res.status(201).json({ message: 'Ticket created', ticket_id: this.lastID });
            });
        };

        if (priority === 0) {
            const pauseQuery = `
                UPDATE Tickets
                SET status = 'Paused'
                WHERE assigned_to = ? AND status = 'In Progress'
            `;
            db.run(pauseQuery, [assigned_to], (err) => {
                if (err) return res.status(500).json({ error: 'Database error during pausing existing tickets' });
                runInsert();
            });
        } else {
            runInsert();
        }
    });

    router.put('/', (req, res) => {
        const { ticket_id, title, description, status, user_id } = req.body;
        let modelStateErrors = [];
        if (!ticket_id) modelStateErrors.push('Ticket ID is required');
        if (!title) modelStateErrors.push('Title is required');
        if (!description) modelStateErrors.push('Description is required');
        if (!status) modelStateErrors.push('Status is required');
        if (!user_id) modelStateErrors.push('User ID is required');
        if (modelStateErrors.length > 0) return res.status(400).json({ errors: modelStateErrors });

        if (status === 'In Progress') {
            const checkQuery = `
                SELECT * FROM Tickets
                WHERE assigned_to = ? AND status = 'In Progress' AND ticket_id <> ?
            `;
            db.get(checkQuery, [user_id, ticket_id], (err, row) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                if (row) return res.status(409).json({ error: 'Another ticket is already in progress for this user' });

                updateTicket();
            });
        } else {
            updateTicket();
        }

        function updateTicket() {
            const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const query = `
                UPDATE Tickets
                SET title = ?, description = ?, status = ?, updated_at = ?
                WHERE ticket_id = ?
            `;
            db.run(query, [title, description, status, updated_at, ticket_id], function (err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.status(201).json({ message: 'Ticket updated', ticket_id: ticket_id });
            });
        }
    });
    return router;
}