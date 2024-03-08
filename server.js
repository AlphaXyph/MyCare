const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
app.use(bodyParser.json());

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'mycare',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// User registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO user_login (name, username, email, password) VALUES (?, ?, ?, ?)',
            [name, username, email, password]
        );
        connection.release();
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} \nUse the following link: http://localhost:${PORT}`);
});
