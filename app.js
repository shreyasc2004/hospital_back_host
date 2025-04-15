require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./dataBase/Sql");
const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
}));
app.use(bodyParser.json());

async function checkSQLiteConnection() {
    return new Promise((resolve) => {
        db.get("SELECT 1", (err) => {
            if (err) {
                console.error('Error connecting to SQLite:', err);
                resolve('Failed');
            } else {
                resolve('Connected');
            }
        });
    });
}

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO LOGIN (username, password) VALUES (?, ?)',
                [username, password],
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            return res.status(400).json({ error: 'Username already exists' });
                        }
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
        res.json({ message: 'Sign Up Successful!' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/appointments', async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM patients ORDER BY date ASC, time ASC', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        res.json(results);
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM LOGIN WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login Successful!', token });
    } catch (err) {
        return res.status(500).json({ error: 'Database query error' });
    }
});

app.post('/getappointment', async (req, res) => {
    const { name, age, gender, address, doctor, date, time } = req.body;
    try {
        await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO patients(name, age, gender, address, doctor, date, time) VALUES(?, ?, ?, ?, ?, ?, ?)',
                [name, age, gender, address, doctor, date, time],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
        res.json({ message: 'Appointment created successfully!' });
    } catch (e) {
        return res.status(500).json({ error: 'Database query error' });
    }
});

if (require.main === module){
    app.listen(PORT, async () => {
        const dbStatus = await checkSQLiteConnection();
        console.log(`SQLite Status: ${dbStatus}`);
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

app.get('/', (req, res) => {
    res.send('Welcome to the Hospital Backend API');
});
module.exports=app;
