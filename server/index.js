import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

import session from 'express-session';
import passport from './passport.js';

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

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Unauthenticated user!" })
};

app.get('/api/courses', (req, res) => {
  const sqlCourses = `
    SELECT Courses.*, count(StudyPlan.SID) as EnrolledStudents
    FROM Courses
    LEFT JOIN StudyPlan ON Courses.CID = StudyPlan.CID
    GROUP BY Courses.CID
    ORDER BY Courses.Name ASC
  `

  db.all(sqlCourses, [], (err, courses) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database retrieval error." });
    }

    const sqlIncomp = `SELECT * FROM CourseIncompatibilities`;

    db.all(sqlIncomp, [], (err, incompRows) => {
      const finalCourses = courses.map((course) => {
        const myIncomp = incompRows.filter((row) => row.CID === course.CID);
        const incompArray = myIncomp.map((row) => row.IncompCourseID);

        return {
          ...course,
          incompatibilities: incompArray
        }
      });

      res.json(finalCourses);
    });
  });
});

app.get('/api/studyplan', isLoggedIn, (req, res) => {
  const sql = `
    SELECT Courses.CID, Courses.Name, Courses.Credits
    FROM StudyPlan
    JOIN Courses ON StudyPlan.CID = Courses.CID
    WHERE StudyPlan.SID = ?
    ORDER BY Courses.CID ASC
  `;

  const studentId = req.user.id || req.user.SID;

  db.all(sql, [studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database retrieval error." });
    }
    res.json(rows);
  });
});

app.put('/api/studyplan', isLoggedIn, (req, res) => {
  const courses = req.body.courses;
  const planType = req.body.planType;
  const sID = req.user.id || req.user.SID;

  const totalCredits = courses.reduce((sum, c) => sum + c.Credits, 0);
  const minC = planType === 'Full-Time' ? 60 : 20;
  const maxC = planType === 'Full-Time' ? 80 : 40;

  if (totalCredits < minC || totalCredits > maxC) {
    return res.status(422).json({ error: "Invalid number of credits" });
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    db.run(`UPDATE Students SET PlanType = ? WHERE SID = ?`, [planType, sID], function (err) {
      if (err) return db.run("ROLLBACK;", () => res.status(500).json({ error: err.message }));
    });

    if (courses.length > 0) {
      const stmt = db.prepare(`INSERT INFO StudyPlan (SID, CID) VALUES (?, ?)`);
      courses.forEach(course => {
        stmt.run([sID, c.CID], function (err) {
          if (err) return db.run("ROLLBACK;", () => res.status(500).json({ error: err.message }));
        });

        stmt.finalize();
      });
    }

    db.run("COMMIT;", () => {
      res.status(200).json({ message: "Study plan saved successfully!" });
    });
  });
});

app.delete('/api/studyplan', isLoggedIn, (req, res) => {
  const sID = req.user.id || req.user.SID;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");

    db.run(`UPDATE Students SET PlanType = NULL WHERE SID = '?`, [sID], function (err) {
      if (err) return db.run("ROLLBACK;", () => res.status(500).json({ error: err.message }));
    });

    db.run(`DELETE FROM StudyPlan WHERE SID = ?`, [sID], function (err) {
      if (err) return db.run("ROLLBACK;", () => res.status(500).json({ error: err.message }));
    });

    db.run("COMMIT;", () => {
      res.status(200).json({ message: "Study plan deleted successfully!" });
    });
  });
});

// Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});