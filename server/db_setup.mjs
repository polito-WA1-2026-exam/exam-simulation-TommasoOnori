import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('studyplan.db', (err) => {
    if (err) {
        console.log(`Connection Failed: ${err.message}`);
    } else {
        console.log("Successfully connected to the SQLite Database.");
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Students(
        SID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Surname TEXT NOT NULL,
        Email TEXT UNIQUE NOT NULL,
        PlanType TEXT,
        HashedPassword TEXT NOT NULL,
        Salt TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Courses(
        CID TEXT PRIMARY KEY,
        Name TEXT NOT NULL,
        Credits INTEGER NOT NULL,
        MaxStudents INTEGER,
        PreparatoryCourse TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS StudyPlan(
        SID INTEGER,
        CID TEXT,
        PRIMARY KEY (SID, CID),
        FOREIGN KEY (SID) REFERENCES Students(SID),
        FOREIGN KEY (CID) REFERENCES Courses(CID)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS CourseIncompatibilities (
        CID TEXT,
        IncompCourseID TEXT,
        PRIMARY KEY (CID, IncompCourseID),
        FOREIGN KEY (CID) REFERENCES Courses(CID),
        FOREIGN KEY (IncompCourseID) REFERENCES Courses(CID)
    )`);

    // Query Blueprint
    const insertCourse = db.prepare(`INSERT OR IGNORE INTO Courses(CID, Name, Credits, MaxStudents, PreparatoryCourse) VALUES (?, ?, ?, ?, ?)`);

    insertCourse.run("02GOLOV", "Architetture dei sistemi di elaborazione", 12, null, null);
    insertCourse.run("02LSEOV", "Computer architectures", 12, null, null);
    insertCourse.run("05BIDOV", "Ingegneria del software", 6, null, "02GOLOV");
    insertCourse.run("04GSPOV", "Software engineering", 6, null, "02LSEOV");
    insertCourse.run("01TXYOV", "Web Applications I", 6, 3, null);
    insertCourse.run("01UDFOV", "Applicazioni Web I", 6, 3, null)

    // Tell the DBMS to free the memory for the blueprint
    insertCourse.finalize();

    const insertIncomp = db.prepare(`INSERT OR IGNORE INTO CourseIncompatibilities(CID, IncompCourseID) VALUES (?, ?)`)

    insertIncomp.run("02GOLOV", "02LSEOV");
    insertIncomp.run("02LSEOV", "02GOLOV");
    insertIncomp.run("05BIDOV", "04GSPOV");
    insertIncomp.run("04GSPOV", "05BIDOV");
    insertIncomp.run("01TXYOV", "01UDFOV");
    insertIncomp.run("01UDFOV", "01TXYOV");

    insertIncomp.finalize();
});

db.close((err) => {
    if (err) {
        console.log(`An error occured: ${err.message}`);
    } else {
        console.log("Connection to the SQLite Database successfully closed. Setup completed!");
    }
});