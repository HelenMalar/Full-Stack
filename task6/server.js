const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/User");
const FormData = require("./models/FormData");
const authMiddleware = require("./middleware/auth");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        res.json({ message: "User Registered Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post("/api/form", authMiddleware, async (req, res) => {
    try {
        const form = new FormData({
            userId: req.user.id,
            data: req.body
        });
        await form.save();
        res.json({ message: "Form Saved Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/api/form", authMiddleware, async (req, res) => {
    const data = await FormData.find({ userId: req.user.id });
    res.json(data);
});
app.listen(3000, () => console.log("Server running on port 3000"));