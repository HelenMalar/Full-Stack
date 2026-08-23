const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    if (!req.session.users) req.session.users = [];
    next();
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.post("/register", (req, res) => {
    const { name, email, password, age, gender, phone, address, skills, country } = req.body;
    if (!name || !email || password.length < 6) {
        return res.status(400).send("Server Validation Failed: Missing fields or weak password.");
    }
    const newUser = {
        name, 
        email, 
        age, 
        gender, 
        phone, 
        address, 
        skills: Array.isArray(skills) ? skills.join(", ") : skills, 
        country
    };
    req.session.users.push(newUser);
    res.redirect("/display");
});
app.get("/display", (req, res) => {
    const users = req.session.users || [];
    let rows = users.map(u => `
        <tr>
            <td style="border:1px solid #ddd; padding:8px;">${u.name}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.email}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.age}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.gender}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.address}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.phone}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.skills}</td>
            <td style="border:1px solid #ddd; padding:8px;">${u.country}</td>
        </tr>`).join("");
    res.send(`
        <body style="font-family:Arial; padding:20px; background:#f4f4f4;">
            <h2 style="text-align:center;">Stored Users</h2>
            <table style="width:100%; background:white; border-collapse:collapse;">
                <tr style="background:#333; color:white;">
                    <th>Name</th><th>Email</th><th>Age</th><th>Gender</th><th>Address</th><th>Phone</th><th>Skills</th><th>Country</th>
                </tr>
                ${rows || '<tr><td colspan="5" style="text-align:center;">No data</td></tr>'}
            </table>
            <br><center><a href="/">Register Another</a></center>
        </body>
    `);
});
app.listen(3000, () => console.log("Server: http://localhost:3000"));