import db from '../utils/db.js'

const tendersController = {};

const changeDateForm = (DateTime) => {
    const originalDateTime = toString(DateTime)
// Step 1: Remove hyphens, colons, and the "T" character
    const step1 = originalDateTime.replace(/-|:|T/g, "");

// Step 2: Remove non-numeric characters, including decimal point and "Z"
    const step2 = step1.replace(/[^0-9]/g, "");

// Result: Format with only numbers
    const result = step2;

    return result
}

tendersController.getTopTenders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tender ORDER BY price DESC LIMIT 10');

        const tenders = result.rows.map(tender => {
            const date = new Date(tender.created_at);
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.getUTCDate().toString().padStart(2, '0');
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');

            const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

            return { ...tender, formattedDate };
        });

        res.json({tenders, tenders_len: result.rows.length});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

tendersController.TodayTenders = async (req, res) => {
    try {
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to 00:00:00

        // Execute the SQL query to fetch tender information created today
        const query = `
      SELECT *
      FROM tender
      WHERE created_at >= $1
    `;
        const values = [today];

        const result = await db.query(query, values);

        const tenders = result.rows.map(tender => {
            const date = new Date(tender.created_at);
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.getUTCDate().toString().padStart(2, '0');
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');

            const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

            return { ...tender, formattedDate };
        });

        res.status(200).json({tenders, tenders_len: result.rows.length});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching tender information.' });
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

        const tenders = result.rows.map(tender => {
            const date = new Date(tender.created_at);
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.getUTCDate().toString().padStart(2, '0');
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');

            const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

            return { ...tender, formattedDate };
        });
        res.json({tenders, tenders_len: result.rows.length});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export default tendersController
