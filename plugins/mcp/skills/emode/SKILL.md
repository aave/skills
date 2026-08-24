---
name: emode
description: Aave eMode — read this before any eMode question or get_emode_categories call: category listing, the higher-LTV trade-off, switching a wallet's category safely — for "eMode", "efficiency mode", "what LTV", "borrow more against correlated assets".
---

# Aave eMode (v3)

v3 only — v4 replaced eMode with risk premiums and dynamic configuration, so on v4 answer from `get_reserve_details` instead.

## Steps

1. `get_emode_categories`, narrowed with `symbols`, for the categories an asset belongs to: each carries the `categoryId` that `prepare_set_emode` takes, its own max LTV, liquidation threshold and penalty, and the member symbols. Markets with no matching category are omitted, not empty.
2. Before any switch, read what the wallet holds (`get_user_positions`): a position in eMode may only hold that category's assets.
3. `prepare_set_emode` with the categoryId (0 turns eMode off) and the market from `get_markets` in this session. Unsigned; the user signs.

## Reporting rules

- Present the trade both ways: higher LTV among the category's correlated assets, at the cost of restricting the position to those assets.
- Quote the category's own LTV / liquidation threshold from step 1, not the reserve's standard parameters — eMode replaces them.
