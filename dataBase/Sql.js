const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'hospital_db.sqlite'), (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Create tables if they don't exist
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER,
                gender TEXT CHECK(gender IN ('male', 'female', 'Other')),
                address TEXT,
                doctor TEXT,
                date TEXT,
                time TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS LOGIN (
                username TEXT UNIQUE,
                password TEXT
            )
        `);
    });
}

module.exports = db;
