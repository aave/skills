---
name: liquidations
description: Aave liquidations — check whether a position is liquidatable, quantify the bonus, or build the liquidation call — for "can this wallet be liquidated", "liquidation bonus", "liquidate 0x…".
---

# Aave liquidations

Liquidation is permissionless protocol mechanics: anyone may repay part of an unhealthy position's debt and receive collateral plus the liquidation bonus, using their own funds.

## Steps

1. Eligibility first: `get_user_summary` on the target wallet. A liquidation is only viable while that position's health factor is below 1.0 — never build one against a healthy position; report its actual health factor instead.
2. Pick the debt to repay and the collateral to seize from `get_user_positions` on the target, with selectors read from `get_markets` in this session (v4: `collateral` / `debt` reserveIds plus `liquidator`; v3: token addresses + market + chainId — the liquidator is whoever signs).
3. `prepare_liquidation` — unsigned; the liquidator's wallet signs and submits, and needs the repay funds in it.

## Reporting rules

- Always report the target's current health factor with the answer.
- "Am I at risk" about the user's own wallet is a position-health question: run the `position-health` skill instead of building anything.

## Done when

- The target's current health factor is in the answer, whether or not a liquidation was built.
- A liquidation is handed over only for a position below 1.0, unsigned, with the repay funds the liquidator needs stated.
