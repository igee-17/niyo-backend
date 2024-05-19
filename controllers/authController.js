const pool = require('../db/db');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../middleware/authentication');


exports.signup = async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    // Validate input
    if (!firstname || !lastname || !email || !phone || !password) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email exists
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
        return res.status(409).send({ message: 'Email already exists' });
    }

    // Insert user into database
    const [result] = await pool.query('INSERT INTO users (firstname, lastname, email, phone, password) VALUES (?, ?, ?, ?, ?)', [
        firstname,
        lastname,
        email,
        phone,
        hashedPassword
    ]);

    const userId = result.insertId; // Assuming the ID is generated on insertion
    const token = generateAccessToken({ id: userId });

    const user = {
        firstname,
        lastname,
        email,
        phone,
        id: userId,
        token
    }

    res.status(201).send({ message: 'User created successfully', user });

}


exports.signin = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).send({ message: 'Missing email or password' });
    }

    // Find user by email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
        return res.status(401).send({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare password hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).send({ message: 'Invalid email or password' });
    }

    // Generate a JWT token 
    const token = generateAccessToken({ id: user.id });

    res.send({ message: 'Login successful', token, user: { ...user, token } });
}

exports.logout = (req, res) => {
    res.send({ message: 'Logged out successfully' });
}