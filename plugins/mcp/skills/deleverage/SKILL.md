---
name: deleverage
description: Reduce the risk on an Aave position — "reduce my risk", "unwind", "get my health factor up", "I'm close to liquidation" — by comparing the routes (repay, repay from collateral, add collateral) on the resulting health factor before recommending one.
---

# Aave deleveraging

Every tool named below comes from Aave's MCP server, `https://mcp.aave.com`. If `get_markets` is not
available, add it first: `claude mcp add --transport http aave https://mcp.aave.com` (Claude Code),
`codex mcp add aave --url https://mcp.aave.com` (Codex), or point any other MCP client at the URL.

There are three ways to lift a health factor, and they cost the user different things. Compare them before recommending one.

## Steps

1. **Inspect** — `get_user_summary` for the health factor, then `get_user_positions` for the debt and collateral by asset. Identify the largest debt and the collateral with the highest liquidation threshold.
2. **Route A: repay from wallet** — `get_markets` with `user` for the debt asset's wallet balance. If the wallet holds it, `preview_action` (action `repay`) at the amount that reaches the target health factor.
3. **Route B: repay from collateral** — on v4, `get_repay_with_supply_quote` for the debt against the collateral; it is atomic and the health factor never passes through a worse state. On v3 there is no atomic route: a withdraw → repay sequence dips the health factor between steps, and that must be said.
4. **Route C: add collateral** — `preview_action` (action `supply`, `enableCollateral: true`) for an asset the wallet holds.
5. **Compare** — one table: route, what the user gives up, health factor after, and what remains at risk. Recommend the route that reaches the target with the least the user must part with, and say why the others rank lower.

## Rules

- Default target health factor is **1.5** unless the user names one. Below 1.1 is urgent: say so first, then compare routes.
- Every simulated route reports its `healthFactorAfter`; a route that cannot be simulated is described as unsimulated, not estimated.
- Build nothing until the user picks a route; then hand over to the `safe-transactions` skill for the build.

## Done when

- Every route the position allows was simulated or quoted, with the health factor after.
- The answer says which route reaches the target with the least given up, and why.
- If the position is on v3, the answer says there is no atomic repay-from-collateral and names the health-factor dip.
