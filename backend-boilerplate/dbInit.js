const fs = require('fs');
const bcrypt = require('bcrypt');

function initDb(db, dbFile) {
    if (!fs.existsSync(dbFile)) {
        db.serialize(() => {
            db.run(`CREATE TABLE Users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            
        });
    }

    db.get(`SELECT COUNT(*) as count FROM Users`, (err, row) => {
        if (err) throw err;

        if (row.count === 0) {
            const password = 'admin1234';
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) throw err;

                db.run(
                `INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
                ['admin', 'admin@admin.com', hash, 'admin']
                );
            });
        }
    });
}

module.exports = { initDb };