---
name: market-structure
description: How Aave is laid out — supported chains per version, v4 hubs and spokes, hub-level liquidity and utilisation — for "which chains is Aave on", "what is a hub or spoke", "v4 architecture", "hub liquidity".
---

# Aave market structure

## Steps

1. `get_chains` for the chain list per version. A chain flagged `notServed` has no market on this API: every read comes back empty for it and its gateway addresses are 0x0 — never send a transaction to one.
2. v4 layout: `get_hubs` — a hub holds the liquidity and global accounting that user-facing spokes draw from — then `get_hub_assets` for one hub's assets, totals, rates and utilisation.
3. What a user can actually supply or borrow lives per spoke in `get_markets`; hub accounting is not a venue. Spokes sharing a hub share its rates.

## Reporting rules

- Keep the three levels distinct: chain → hub (liquidity and accounting) → spoke (where users act).
- An empty read on a `notServed` chain says nothing about the chain itself — Aave supports it; this API holds no market there.
