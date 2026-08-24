---
name: safe-transactions
description: Prepare an Aave state change — supply, borrow, withdraw, repay, or any other prepare_* action — when asked to supply/borrow/repay/withdraw, close or adjust a position, or build an Aave transaction.
---

# Aave transaction preparation

Non-custodial: every tool here returns an unsigned transaction for the user's own wallet to sign. Never present a prepared transaction as executed.

## Steps

1. **Discover** — `get_markets` with `symbols`, and `user` set to the sender, in this session even when a market looks familiar: selectors (v4 `reserveId`; v3 `market` + `token` + `chainId`) are deployment-specific and cannot be recalled. The `user` rows say what this wallet can actually supply or borrow before anything is built.
2. **Simulate** — `preview_action` with the exact parameters you intend to build. Mandatory before every borrow and withdraw; run it for supply and repay too, as the cheapest place to fail. An error-level warning means the action cannot succeed as specified: fix the inputs or tell the user — do not build it.
3. **Build** — `prepare_action` with the same selectors and amount. Follow the returned plan in order: an approval step comes before the action, and a sent transaction is confirmed with `get_transaction_processed` before building one that depends on it.
4. **Present** — show the unsigned transaction, the simulated outcome (the health factor after, for anything touching debt or collateral), and every warning (warning level succeeds but must reach the user). Then stop: signing is the user's move.

## Rules

- Amounts are in main units (`"10.5"` = 10.5 USDC), never base units or wei.
- Borrowing needs collateral enabled: a plain supply backs nothing. Pass `enableCollateral: true` when the plan includes borrowing against it.
- The same discipline — read current state, simulate where offered, surface warnings, hand over unsigned — applies to every other `prepare_*` tool (swaps, collateral toggles, e-mode, rewards, sGHO).
