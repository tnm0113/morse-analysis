// api/data.js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    const { data, error } = await supabase
        .from("holders")
        .select("address, nft_id, days_since, rarity");
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
}
