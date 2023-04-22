import users from '../models/users.js'

const usersController = {};

usersController.login = (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
    }

    res.json({ message: 'Login successful', user });
};

export default usersController
