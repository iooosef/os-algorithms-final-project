const bcrypt = require('bcrypt');

function initDb(db) {
  const tables = ['Users', 'Projects', 'Tickets', 'Comments', 'SchedulerLog'];

  db.serialize(() => {
    db.all(
      `SELECT name FROM sqlite_master WHERE type='table' AND name IN (${tables.map(() => '?').join(',')})`,
      tables,
      (err, rows) => {
        if (err) throw err;

        const existingTables = rows.map(r => r.name);
        const missingTables = tables.filter(t => !existingTables.includes(t));

          // Insert admin user if Users table was created and empty
          if (missingTables.includes('Users')) {
            db.run(`CREATE TABLE IF NOT EXISTS Users (
              user_id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT NOT NULL UNIQUE,
              email TEXT NOT NULL UNIQUE,
              password_hash TEXT NOT NULL,
              role TEXT NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
              if (err) throw err;

              db.get(`SELECT COUNT(*) as count FROM Users`, (err, row) => {
                if (err) throw err;

                if (row.count === 0) {
                  const saltRounds = 10;
                  // init admin acc
                  bcrypt.hash('admin1234', saltRounds, (err, hash) => {
                    if (err) throw err;
                    db.run(
                      `INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
                      ['admin', 'admin@admin.com', hash, 'admin']
                    );
                  });
                  // init other npc accs
                  const npcPass = 'password'
                  bcrypt.hash(npcPass, saltRounds, (err, hash) => {
                    if (err) throw err;
                    db.run(
                      `INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
                      ['hawktuah', 'hawktuah@gmail.com', hash, 'user']
                    );
                  });
                  bcrypt.hash(npcPass, saltRounds, (err, hash) => {
                    if (err) throw err;
                    db.run(
                      `INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
                      ['gurth', 'yo_gurt@gmail.com', hash, 'user']
                    );
                  });
                  bcrypt.hash(npcPass, saltRounds, (err, hash) => {
                    if (err) throw err;
                    db.run(
                      `INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
                      ['tralalelo', 'tralala@gmail.com', hash, 'user']
                    );
                  });
                  
                }
              });
            });
            }

        if (missingTables.length > 0) {
          if (missingTables.includes('Projects')) {
            db.run(`CREATE TABLE IF NOT EXISTS Projects (
              project_id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              description TEXT,
              created_by INTEGER NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (created_by) REFERENCES Users(user_id)
            );`, 
              (err) => {
                if (err) throw err;
                db.get(`SELECT COUNT(*) as count FROM Users`, (err, row) => {
                  if (err) throw err;
                  if (row.count === 0) {
                    db.run(`INSERT INTO Projects (name, description, created_by, created_at, updated_at)
             VALUES ('Priori', 'JIRA-inspired task management system', 1, datetime('now'), datetime('now'));`) 
                  }
                })
              }
            );
          }

          if (missingTables.includes('Tickets')) {
            db.run(
              `CREATE TABLE Tickets (
                ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                priority INTEGER NOT NULL, -- 1 = High...
                status TEXT NOT NULL, -- "Queued", "In Progress", "Paused", "Completed"
                created_by INTEGER NOT NULL,
                assigned_to INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                due_date DATETIME,
                FOREIGN KEY (project_id) REFERENCES Projects(project_id),
                FOREIGN KEY (created_by) REFERENCES Users(user_id),
                FOREIGN KEY (assigned_to) REFERENCES Users(user_id)
              );`,
              (err) => {
                if (err) throw err;
                db.get(`SELECT COUNT(*) as count FROM Users`, (err, row) => {
                  if (err) throw err;
                  if (row.count === 0) {
                    db.run(
                      `INSERT INTO Tickets (project_id, title, description, priority, status, created_by, assigned_to, created_at, updated_at, due_date)
                      VALUES 
                        (1, 'Fix login bug', 'Users cannot log in with correct credentials.', 0, 'Completed', 1, 2, datetime('now', '-7 days'), datetime('now', '-4 days'), '2025-06-01'),
                        (1, 'Implement dark mode', 'Add dark mode toggle in settings.', 2, 'In Progress', 2, 3, datetime('now', '-5 days'), datetime('now', '-2 days'), '2025-06-10'),
                        (1, 'Database schema update', 'Add new fields to support audit logs.', 1, 'In Progress', 3, 4, datetime('now', '-6 days'), datetime('now', '-6 days'), '2025-06-05'),
                        (1, 'Optimize image loading', 'Compress images and lazy load.', 3, 'Completed', 4, 1, datetime('now', '-10 days'), datetime('now', '-7 days'), '2025-05-15'),
                        -- Tasks assigned to user 2
                        (1, 'Setup CI pipeline', 'Configure CI for automated testing.', 1, 'Queued', 1, 2, datetime('now', '-3 days'), datetime('now', '-3 days'), '2025-06-05'),
                        (1, 'Update README', 'Improve documentation with setup steps.', 2, 'Queued', 1, 2, datetime('now', '-2 days'), datetime('now', '-2 days'), '2025-06-06'),
                        (1, 'Refactor auth module', 'Clean up and optimize authentication logic.', 3, 'Queued', 1, 2, datetime('now', '-1 days'), datetime('now', '-1 days'), '2025-06-07'),
                        (1, 'Add forgot password flow', 'Implement email-based password reset.', 1, 'Queued', 1, 2, datetime('now', '-4 days'), datetime('now', '-4 days'), '2025-06-08'),
                        (1, 'Add logging middleware', 'Track API calls for debugging.', 2, 'Queued', 1, 2, datetime('now', '-5 days'), datetime('now', '-5 days'), '2025-06-09'),
                        -- Tasks assigned to user 3
                        (1, 'Create user settings page', 'Add UI for updating user preferences.', 1, 'Queued', 1, 3, datetime('now', '-3 days'), datetime('now', '-3 days'), '2025-06-05'),
                        (1, 'Validate email inputs', 'Add client-side and server-side email validation.', 2, 'Queued', 1, 3, datetime('now', '-2 days'), datetime('now', '-2 days'), '2025-06-06'),
                        (1, 'Fix mobile layout', 'Resolve responsiveness issues on small screens.', 3, 'Queued', 1, 3, datetime('now', '-1 days'), datetime('now', '-1 days'), '2025-06-07'),
                        (1, 'Enhance accessibility', 'Improve screen reader support.', 1, 'Queued', 1, 3, datetime('now', '-4 days'), datetime('now', '-4 days'), '2025-06-08'),
                        (1, 'Add 2FA support', 'Implement two-factor authentication.', 2, 'Queued', 1, 3, datetime('now', '-5 days'), datetime('now', '-5 days'), '2025-06-09'),
                        -- Tasks assigned to user 4
                        (1, 'Integrate payment gateway', 'Support Stripe payments.', 1, 'Queued', 1, 4, datetime('now', '-3 days'), datetime('now', '-3 days'), '2025-06-05'),
                        (1, 'Build dashboard analytics', 'Display user stats and trends.', 2, 'Queued', 1, 4, datetime('now', '-2 days'), datetime('now', '-2 days'), '2025-06-06'),
                        (1, 'Fix broken links', 'Audit and fix all 404 links.', 3, 'Queued', 1, 4, datetime('now', '-1 days'), datetime('now', '-1 days'), '2025-06-07'),
                        (1, 'Setup staging environment', 'Deploy staging instance for QA.', 1, 'Queued', 1, 4, datetime('now', '-4 days'), datetime('now', '-4 days'), '2025-06-08'),
                        (1, 'Implement user tagging', 'Allow tagging users in comments.', 2, 'Queued', 1, 4, datetime('now', '-5 days'), datetime('now', '-5 days'), '2025-06-09');                        
                      ;`
                    );
                  }
                });
              }
            );
          }


          if (missingTables.includes('Comments')) {
            db.run(`CREATE TABLE IF NOT EXISTS Comments (
              comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
              ticket_id INTEGER NOT NULL,
              user_id INTEGER NOT NULL,
              comment_text TEXT NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id),
              FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )`);
          }

          if (missingTables.includes('SchedulerLog')) {
            db.run(`CREATE TABLE SchedulerLog (
              log_id INTEGER PRIMARY KEY AUTOINCREMENT,
              ticket_id INTEGER,
              start_time DATETIME,
              end_time DATETIME,
              event TEXT, -- "started", "paused", "resumed", "completed"
              FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id)
            )`);
          }

        }
      }
    );
  });
}

module.exports = { initDb };