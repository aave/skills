---
name: position-health
description: Review an Aave wallet's risk — health factor, liquidation distance, open positions — when asked "what's my health factor", "is 0x… safe", "review my Aave position", or any wallet risk check.
---

# Aave position health review

Read-only review; nothing here prepares or signs anything.

## Steps

1. `get_user_summary` with the wallet, no `chainId`, version `all` — one call covers every chain both versions serve.
2. `get_user_positions` for per-asset detail on whatever the summary surfaces.
3. When the question is about risk over time, `get_user_summary_history` (v4): how close to liquidation the wallet has been across the window.
4. Report using every rule below.

## Reporting rules

- Lead with the worst health factor. Below 1.0 the position is liquidatable right now; below ~1.1, warn prominently — a small price move liquidates it.
- Health factors never aggregate. v3 has one per market and v4 one per position; report each on its own, never an average or a sum across them.
- Name the coverage: say which chains were read (`chainsCovered`). A chain under `chainsNotServed` returned no data, so say "no data", not "no position", for it.
- An empty summary means no Aave position, not an empty wallet — token balances are not in it. When holdings matter, pass `user` to `get_markets` for per-reserve wallet balances.
