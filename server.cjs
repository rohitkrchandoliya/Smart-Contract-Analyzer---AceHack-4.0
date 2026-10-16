require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const BSC_API_KEY = process.env.BSC_API_KEY || "";
const MORALIS_API_KEY = process.env.MORALIS_API_KEY || "";
const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/api/contract-analysis", async (req, res) => {
    const address = typeof req.query.address === "string" ? req.query.address.trim() : "";
    if (!ADDRESS_PATTERN.test(address)) {
        return res.status(400).json({ error: "Enter a valid EVM address (0x followed by 40 hexadecimal characters)." });
    }
    if (!BSC_API_KEY) {
        return res.status(503).json({ error: "BscScan API is not configured. Add BSC_API_KEY to the server environment." });
    }

    try {
        const params = new URLSearchParams({
            chainid: "56",
            module: "contract",
            action: "getsourcecode",
            address,
            apikey: BSC_API_KEY
        });
        const response = await fetch("https://api.etherscan.io/v2/api?" + params.toString(), {
            signal: AbortSignal.timeout(15000)
        });
        if (!response.ok) throw new Error("BscScan returned HTTP " + response.status);
        const data = await response.json();
        if (data.status !== "1" || !Array.isArray(data.result) || !data.result[0]) {
            return res.status(404).json({ error: data.message || "No contract metadata found for this address." });
        }

        const contract = data.result[0];
        const verified = typeof contract.SourceCode === "string" && contract.SourceCode.trim().length > 0;
        let walletBalance = null;
        if (MORALIS_API_KEY) {
            try {
                const balanceResponse = await fetch(
                    "https://deep-index.moralis.io/api/v2.2/" + encodeURIComponent(address) + "/balance?chain=bsc",
                    { headers: { "X-API-Key": MORALIS_API_KEY }, signal: AbortSignal.timeout(10000) }
                );
                if (balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    const raw = BigInt(balanceData.balance || "0");
                    const whole = raw / 1000000000000000000n;
                    const fraction = (raw % 1000000000000000000n).toString().padStart(18, "0").slice(0, 4);
                    walletBalance = whole.toString() + "." + fraction;
                }
            } catch {
                // Balance is optional; do not fail contract metadata if Moralis is unavailable.
            }
        }

        return res.json({
            address,
            contractName: contract.ContractName || "Unknown",
            compilerVersion: contract.CompilerVersion || "Unknown",
            verified,
            chain: "BNB Smart Chain",
            walletBalance
        });
    } catch (error) {
        console.error("Contract analysis request failed:", error.message);
        return res.status(502).json({ error: "Could not fetch contract metadata. Please try again." });
    }
});

app.listen(PORT, () => console.log("Smart Contract Analyzer listening on port " + PORT));
