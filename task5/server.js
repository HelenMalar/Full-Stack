const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
let items = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" }
];
let currentId = 3;
app.get("/api/items", (req, res) => {
  res.json(items);
});
app.get("/api/items/:id", (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});
app.post("/api/items", (req, res) => {
  const newItem = {
    id: currentId++,
    name: req.body.name
  };
  items.push(newItem);
  res.status(201).json(newItem);
});
app.put("/api/items/:id", (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.name = req.body.name;
  res.json(item);
});
app.delete("/api/items/:id", (req, res) => {
  items = items.filter(i => i.id !== parseInt(req.params.id));
  res.json({ message: "Item deleted" });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});