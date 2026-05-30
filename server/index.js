import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

import session from 'express-session';

// Init Express
const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

const db = new sqlite3.Database('studyplan.db', (err) => {
  if (err) throw err;
});

app.use(session({
  secret: "My Secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.authenticate('session'));

// ============= AUTHENTICATION API =============

app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json(req.user);
    });
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Unauthenticated user!" });
  }
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// ============= PUBLIC APIs =============

app.get('/api/courses', (req, res) => {
  const sql = `SELECT * FROM Courses ORDER BY Name ASC`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database retrivial error." });
    }
    res.json(rows);
  });
});

// Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});