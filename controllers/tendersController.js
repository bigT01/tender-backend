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

export default tendersController
