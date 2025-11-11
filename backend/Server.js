import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection (RDS)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL");
});

// Example route
app.get("/api/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.listen(5000, () => console.log("🚀 Backend running on port 5000"));
