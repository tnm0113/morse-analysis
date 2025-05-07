import express from "express";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get("/api/data", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("holders")
            .select("address, nft_id, days_since, rarity");
        if (error) throw error;
        // optional caching headers
        res.setHeader("Cache-Control", "public, max-age=60");
        res.json(data);
    } catch (err) {
        console.error("Supabase error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
