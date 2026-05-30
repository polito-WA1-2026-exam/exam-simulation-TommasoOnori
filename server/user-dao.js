import sqlite3 from 'sqlite3'
import crypto from 'crypto'

const db = new sqlite3.Database('studyplan.db', (err) => {
    if (err) throw err;
});

// For Email and Password Validation
export const getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Students WHERE Email = ?';

        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row == undefined) {
                resolve(false); // User Not Found
            } else {
                const user = {
                    id: row.SID,
                    name: row.Name,
                    surname: row.Surname,
                    email: row.Email,
                    planType: row.PlanType
                };

                crypto.scrypt(password, row.Salt, 32, (err, hashedPassword) => {
                    if (err) {
                        reject(err);
                    }

                    const passwordHex = Buffer.from(row.HashedPassword, 'hex');

                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
                        resolve(false) // Wrong Password
                    } else {
                        resolve(user); // Return the User
                    }
                });
            }
        });
    });
};

// Retrivial by ID
export const getUserByID = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Students WHERE SID = ?';

        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row == undefined) {
                resolve({ error: "User Not Found." });
            } else {
                const user = {
                    id: row.SID,
                    name: row.Name,
                    surname: row.Surname,
                    email: row.Email,
                    planType: row.PlanType
                };
                resolve(user);
            }
        });
    });
};