---
name: liquidations
description: Aave liquidations — check whether a position is liquidatable, quantify the bonus, or build the liquidation call — for "can this wallet be liquidated", "liquidation bonus", "liquidate 0x…".
---

# Aave liquidations

Liquidation is permissionless protocol mechanics: anyone may repay part of an unhealthy position's debt and receive collateral plus the liquidation bonus, using their own funds.

## Steps

1. Eligibility first: `get_user_summary` on the target wallet. A liquidation is only viable while that position's health factor is below 1.0 — never build one against a healthy position; report its actual health factor instead.
2. Pick the debt to repay and the collateral to seize from `get_user_positions` on the target, with selectors from `get_markets` in this session (v4: `collateral` / `debt` reserveIds plus `liquidator`; v3: token addresses + market + chainId — the liquidator is whoever signs).
3. `prepare_liquidation` — unsigned; the liquidator's wallet signs and submits, and needs the repay funds in it.

## Reporting rules

- Always report the target's current health factor with the answer.
- "Am I at risk" about the user's own wallet is a position-health question, not a liquidation to build: worst health factor first, per market.
