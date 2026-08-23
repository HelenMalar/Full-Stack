const express = require("express");
const cors = require("cors");   
const morgan = require("morgan");
const app = express()
app.use(cors()); 
app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Server is running 🚀");
});
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});