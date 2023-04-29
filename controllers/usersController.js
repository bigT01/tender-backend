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

usersController.saveSearchInformation = async (req, res) => {
    try {
        const { userId, keyWords, deadline, price, repeats, priority, methodBuy, conditionPayment } = req.body;
        const id = uuidv4();
        // Check for null or undefined values and assign default values if necessary
        const searchInfo = {
            userId: userId || null,
            name: keyWords || null,
            deadline: deadline || null,
            price: price || null,
            repeatCondition: repeats || null,
            priority: priority || null,
            method_buy: methodBuy || null,
            condition_payment: conditionPayment || null
        };

        // Execute the SQL query to insert the search information into the searchInfo table
        const query = `
      INSERT INTO searchInfo (id, userId, name, deadline, price, repeatCondition, priority, method_buy, condition_payment)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
        const values = [
            id,
            searchInfo.userId,
            searchInfo.name,
            searchInfo.deadline,
            searchInfo.price,
            searchInfo.repeatCondition,
            searchInfo.priority,
            searchInfo.method_buy,
            searchInfo.condition_payment
        ];

        await db.query(query, values);

        res.status(200).json({ message: 'Search information saved successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while saving search information.' });
    }
}

usersController.showSearchInformation = async (req, res) => {
    try{
        const { userId } = req.params;

        const result = await db.query('select * from searchInfo where userId = $1', [userId]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while saving search information.' });
    }
}

export default usersController
