---
name: safe-transactions
description: Prepare an Aave state change — supply, borrow, withdraw, repay, or any other prepare_* action — when asked to supply/borrow/repay/withdraw, close or adjust a position, or build an Aave transaction.
---

# Aave transaction preparation

Non-custodial: every tool here returns an **unsigned** transaction for the user's own wallet to sign. Say what a prepared transaction will do once signed, and that nothing has been sent.

The chain is **discover → inspect → simulate → build**, then hand over unsigned.

## Steps

1. **Discover** — `get_markets` with `symbols`, and `user` set to the sender, in this session even when a market looks familiar: selectors (v4 `reserveId`; v3 `market` + `token` + `chainId`) are deployment-specific and cannot be recalled. The `user` rows say what this wallet can actually supply or borrow before anything is built.
2. **Inspect** — `get_user_summary` for what the wallet already owes and how much room it has, and `get_reserve_details` where the reserve's own parameters bear on the action. A borrow or a withdraw sized without this is a guess.
3. **Simulate** — `preview_action` with the exact parameters you intend to build. Mandatory before every borrow and withdraw; run it for supply and repay too. An error-level warning means the action cannot succeed as specified: fix the inputs or tell the user, rather than building it.
4. **Build** — `prepare_action` with the same selectors and amount. Follow the returned plan in order: an approval step comes before the action, and a sent transaction is confirmed with `get_transaction_processed` before building one that depends on it.
5. **Hand over** — show the unsigned transaction, the simulated outcome (the health factor after, for anything touching debt or collateral), and every warning (warning level succeeds but must reach the user). Then stop: signing is the user's move.

## Rules

- Amounts are in main units (`"10.5"` = 10.5 USDC), never base units or wei.
- Borrowing needs collateral enabled: a plain supply backs nothing. Pass `enableCollateral: true` when the plan includes borrowing against it.
- The same chain — discover, inspect, simulate, build, hand over unsigned — applies to every other `prepare_*` tool (swaps, collateral toggles, e-mode, rewards, sGHO).

## Done when

- The simulation ran on the exact parameters that were built, and its outcome is in the answer.
- Every warning the server returned reached the user, by level.
- The transaction is presented unsigned, with the post-action health factor wherever debt or collateral moved.

## Why simulate first

`preview_action` is the cheapest place for an action to fail, and the only place that reports the position's shape: it returns the resulting health factor, which the build step does not. Skipping it costs a round trip on a refusal and, worse, hands the user a transaction whose effect on their health factor nobody has read. A clean simulation reports the position's own limits, not token allowances — an approval step can still be waiting in the plan.
