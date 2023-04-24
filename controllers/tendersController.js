import db from '../utils/db.js'

const tendersController = {};

tendersController.getTopTenders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tender ORDER BY price DESC LIMIT 10');
        res.json({tenders:result.rows, tenders_len: result.rows.length});
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
        query += ` AND name LIKE $1`;
        params.push(`%${keyWords}%`);
    }
    if (startPrice) {
        query += ` AND price::numeric >= CAST($${params.length+1} AS numeric)`;
        params.push(startPrice);
    }
    if (endPrice) {
        query += ` AND price::numeric <= CAST($${params.length+1} AS numeric)`;
        params.push(endPrice);
    }
    if (repeats) {
        query += ` AND repeatcondition::text = $${params.length+1}`;
        params.push(repeats);
    }
    if (priority) {
        query += ` AND priority::text <> $${params.length+1}`;
        params.push(priority);
    }
    if (methodBuy) {
        query += ` AND method_buy::text = $${params.length+1}`;
        params.push(methodBuy);
    }
    if (conditionPayment) {
        query += ` AND condition_payment::text = $${params.length+1}`;
        params.push(conditionPayment);
    }
    try {
        const result = await db.query(query, params);
        res.json({tenders:result.rows, tenders_len: result.rows.length});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export default tendersController
