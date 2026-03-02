const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Test-Route
app.get("/", (req, res) => {
  res.send("Server läuft 🚀");
});

// Beispiel API Route
app.get("/api/user", (req, res) => {
  res.json({
    id: 1,
    name: "Max Mustermann"
  });
});

// POST Beispiel
app.post("/api/user", (req, res) => {
  const user = req.body;
  res.status(201).json({
    message: "User erstellt",
    user: user
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});