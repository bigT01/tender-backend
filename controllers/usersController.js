import users from '../models/users.js';
import db from '../utils/db.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

const usersController = {};

usersController.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by username in the database
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rowCount === 0) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        // Compare the hashed password with the user input using bcrypt
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

usersController.signUp = async (req, res, next) => {
    try {
        // Get user input from request body
        const {email, password } = req.body;
        const id = uuidv4();

        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Execute the SQL query to insert a new user into the database
        const queryText = 'INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING *';
        const queryValues = [id, email, hashedPassword];
        const result = await db.query(queryText, queryValues);

        // Send a success response with the saved user object
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Handle errors and send an error response
        next(error);
    }
};

export default usersController
