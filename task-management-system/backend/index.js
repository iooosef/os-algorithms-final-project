const fs = require('fs');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('db.sqlite');
const dbFile = './db.sqlite'

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173', // frontend dev port
};
app.use(cors(corsOptions));

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
    db.run(`CREATE TABLE Projects (
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES Users(user_id)
    )`);
    db.run(
        `CREATE TABLE Tickets (
            ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT NOT NULL,
            status TEXT NOT NULL,
            created_by INTEGER NOT NULL,
            assigned_to INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            due_date DATETIME,
            FOREIGN KEY (project_id) REFERENCES Projects(project_id),
            FOREIGN KEY (created_by) REFERENCES Users(user_id),
            FOREIGN KEY (assigned_to) REFERENCES Users(user_id)
        );`
    );
    db.run(
        `CREATE TABLE Comments (
            comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            comment_text TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id),
            FOREIGN KEY (user_id) REFERENCES Users(user_id)
        );`
    );
    db.run(
        `CREATE TABLE TaskHistory (
            history_id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id INTEGER NOT NULL,
            changed_by INTEGER NOT NULL,
            field_changed TEXT NOT NULL,
            old_value TEXT,
            new_value TEXT,
            changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id),
            FOREIGN KEY (changed_by) REFERENCES Users(user_id)
        );`
    );
});
}

app.get('/test', (req, res) => {
  res.send("Hello World");
});
app.listen(3001, () => console.log('API running on port 3001'));
