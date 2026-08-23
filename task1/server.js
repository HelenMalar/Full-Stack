const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
let users = [];
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', { error: null });
});
app.post('/submit', (req, res) => {
    const { name, email, age, city } = req.body;
    if (!name || !email || !age || !city) {
        return res.render('index', { error: "All fields are required!" });
    }
    users.push({ name, email, age, city });
    res.render('result', { name, email, age, city });
});
app.get('/users', (req, res) => {
    res.render('users', { users });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});