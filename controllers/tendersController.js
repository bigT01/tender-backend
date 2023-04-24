import db from '../utils/db.js'

const tendersController = {};

tendersController.getTopTenders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tender ORDER BY price DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

tendersController.filterTenders = async (req, res) => {
    const { keyWords, startPrice, endPrice, repeats, applicationsStart, applicationsEnd, priority, methodBuy, conditionPayment} = req.body;
    const params = [];
    let query = 'SELECT * FROM tender WHERE 1=1';
    if (keyWords) {
        query += ' AND name LIKE $1';
        params.push(`%${keyWords}%`);
    }
    if (applicationsEnd) {
        query += ' AND deadline <= $2';
        params.push(applicationsEnd);
    }
    if (applicationsStart) {
        query += ' AND deadline >= $2';
        params.push(applicationsStart);
    }
    if (startPrice) {
        query += ' AND price >= $3';
        params.push(startPrice);
    }
    if (endPrice) {
        query += ' AND price <= $3';
        params.push(endPrice);
    }
    if (repeats) {
        query += ' AND repeatcondition = $3';
        params.push(repeats);
    }
    if (priority) {
        query += ' AND priority <> $3';
        params.push(priority);
    }
    if (methodBuy) {
        query += ' AND method_buy = $3';
        params.push(methodBuy);
    }
    if (conditionPayment) {
        query += ' AND condition_payment = $3';
        params.push(conditionPayment);
    }
    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export default tendersController
