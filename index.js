const Database = require("better-sqlite3");

const db = new Database("morse_holders.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS holders (
    address TEXT NOT NULL,
    nft_id          TEXT NOT NULL,
    days_since      REAL,
    rarity          TEXT,
    PRIMARY KEY (address, nft_id)
  );
`);

function startServer() {
    const express = require("express");
    const app = express();
    app.use(express.static("public")); // serve our HTML+JS
    app.get("/api/data", (req, res) => {
        const rows = db.prepare("SELECT * FROM holders").all();
        res.json(rows);
    });
    app.listen(3000, () => console.log("→ http://localhost:3000"));
}

async function main() {
    startServer();
}

main().catch(console.error);
