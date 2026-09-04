---
name: yield-analysis
description: Compare Aave yields and rates — best APY for an asset, rates across chains or between V3 and V4, APY history and stability, GHO savings (sGHO) — before recommending where to supply or borrow.
---

# Aave yield and market analysis

Every tool named below comes from Aave's MCP server, `https://mcp.aave.com`. If `get_markets` is not
available, add it first: `claude mcp add --transport http aave https://mcp.aave.com` (Claude Code),
`codex mcp add aave --url https://mcp.aave.com` (Codex), or point any other MCP client at the URL.

## Steps

1. `get_markets` with `symbols` for the assets in question, no `chainId`, version `all`. The symbol filter is what makes v3 cross-chain — unfiltered v3 reads Ethereum alone.
2. Shortlist, then per candidate: `get_reserve_details` for risk parameters and the rate curve, `get_apy_history` for how the spot rate has moved.
3. GHO savings questions: `get_sgho_vault`. Its rate is governance-set, not utilisation-driven, and sGHO is not collateral — present it as savings, not as a lending position.

## Reporting rules

- State the coverage with the numbers: which chains were read (`chainsCovered`), which were not (`chainsNotCovered`), and that `chainsNotServed` chains hold no data here at all.
- Say whether the answer is a sample or the population. "Top 5 by APY" filtered from one call is a sample; only an unfiltered read of every covered chain supports "the best rate on Aave is…".
- Rank only **enterable** rates: skip rows flagged `isFrozen` / `isPaused` / cap-reached, and check `suppliable` / `borrowable` (v4) or `availableLiquidity` (v3) against the size in question. A great APY with no capacity is not an option.
- Spot APY is variable: for any recommendation, quote the recent range from `get_apy_history` next to the spot figure.
- v4 spokes sharing a hub share its rate — identical APYs across spoke rows are one underlying rate, not independent options.

## Done when

- Every chain read is named, and every chain not read is named as not-read.
- The answer says whether it is a sample or the population; "the best rate on Aave" appears only behind an unfiltered read of every covered chain.
- Every ranked row is enterable, with its capacity checked against the size asked for.
- Every spot APY quoted for a recommendation carries its recent range beside it.
