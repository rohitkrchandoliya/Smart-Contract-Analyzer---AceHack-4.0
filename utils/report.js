/**
 * Generate a transparent metadata report.
 * Contract metadata alone is not a security audit and must not receive a random score.
 */
export function generateReport(contractData) {
    return [
        "Smart Contract Metadata Report:",
        "Name: " + (contractData.name || "Unknown"),
        "Compiler: " + (contractData.compiler || "Unknown"),
        "Verified source: " + (contractData.verified ? "Yes" : "No"),
        "Security assessment: Not performed by this metadata report."
    ].join("\n");
}
