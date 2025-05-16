const fs = require('fs');
const bcrypt = require('bcrypt');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { initDb } = require('./dbInit');
const app = express();
const db = new sqlite3.Database('DATABASE.sqlite');
const corsMiddleware = require('./corsConfig');
const authMiddleware = require('./authMiddleware');
const dbFile = './db.sqlite'
// controller imports
const authRoutes = require('./controller/auth')(db);

initDb(db, dbFile);

app.use(express.json());
app.use(corsMiddleware);
app.use(session({
  secret: 'tralalelo-tralala',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));
// controller use
app.use('/auth', authRoutes);

app.get('/test', (req, res) => {
  res.send("Hello World");
});

app.get('/admin', authMiddleware('admin'), (req, res) => {
  res.send('Admin Test');
});

app.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});


app.listen(3001, () => console.log('API running on port 3001'));
