import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import passport from './passport';

const db = new sqlite3.Database('studyplan.db');

// I dati del nostro studente di prova
const name = "Tommaso";
const surname = "Onori";
const email = "test@polito.it";
const planType = "Full-Time";
const password = "password123";

// 1. Generiamo un Salt casuale di 16 byte
const salt = crypto.randomBytes(16).toString('hex');

// 2. Calcoliamo l'hash della password mescolata con il salt
crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
    if (err) throw err;

    // 3. Inseriamo tutto nel database
    const sql = `INSERT INTO Students (Name, Surname, Email, PlanType, HashedPassword, Salt) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [name, surname, email, planType, hashedPassword.toString('hex'), salt], function (err) {
        if (err) {
            console.error("Errore nell'inserimento:", err.message);
        } else {
            console.log(`Studente inserito con successo! (SID: ${this.lastID})`);
            console.log(`Credenziali di accesso -> Email: ${email} | Password: ${password}`);
        }

        db.close();
    });
});