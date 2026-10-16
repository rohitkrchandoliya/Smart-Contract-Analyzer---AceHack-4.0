async function analyzeContract() {
    const address = document.getElementById("contractAddress").value.trim();
    const output = document.getElementById("reportOutput");

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        output.textContent = "Please enter a valid EVM contract address.";
        return;
    }

    output.textContent = "Fetching contract metadata…";
    try {
        const response = await fetch("/api/contract-analysis?address=" + encodeURIComponent(address));
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not analyze this address.");

        const lines = [
            "Contract: " + data.contractName,
            "Compiler: " + data.compilerVersion,
            "Verified source code: " + (data.verified ? "Yes" : "No"),
            "Chain: " + data.chain,
            "Wallet balance: " + (data.walletBalance === null ? "Unavailable (optional Moralis API not configured)" : data.walletBalance + " BNB"),
            "",
            "Security risk score: Not assessed. This tool retrieves contract metadata only; it does not run a vulnerability audit."
        ];
        output.textContent = lines.join("\n");
    } catch (error) {
        output.textContent = error instanceof Error ? error.message : "Could not fetch contract data.";
    }
}

const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
}
