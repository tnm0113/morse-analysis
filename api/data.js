import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    try {
        const pageSize = 1000;
        let page = 0;
        let allRows = [];

        while (true) {
            const from = page * pageSize;
            const to = from + pageSize - 1;

            const { data, error } = await supabase
                .from("holders")
                .select("address, nft_id, days_since, rarity")
                .range(from, to);

            if (error) throw error;
            allRows.push(...data);

            // if we got fewer than pageSize rows, we’re done
            if (data.length < pageSize) break;

            page++;
        }

        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
        res.status(200).json(allRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
