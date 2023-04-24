import express from 'express'
const app = express();
const port = 3001;

import usersController from "./controllers/usersController.js";
import tendersController from "./controllers/tendersController.js"


app.use(express.json());

app.post('/login', usersController.login);
app.post('/signup', usersController.signUp);

app.get('/toptenders', tendersController.getTopTenders);
app.post('/tenders/filter', tendersController.filterTenders);


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
