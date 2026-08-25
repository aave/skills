---
name: position-swaps
description: Restructure an Aave position without exiting it — swap collateral to a different asset, swap one debt for another, or repay a borrow from supplied collateral — for "switch my collateral", "move my debt to", "repay from collateral", "deleverage".
---

# Aave position swaps (v4)

These tools exist on v4 only, and they are atomic: funds never leave Aave and the health factor never passes through an in-between state.

## Steps

1. `get_user_positions` for the wallet, take the `spokeId`, then `get_position_items` (side `supply` for collateral swaps, `borrow` for debt swaps or the debt being repaid). The `positionItemId` is what a swap sells.
2. Quote it: `get_position_swap_quote` (kind `supply` = collateral swap, `borrow` = debt swap) with the `buyReserve` selector read from `get_markets` in this session — or `get_repay_with_supply_quote` to pay debt down from collateral. Prefer that atomic quote over a hand-rolled withdraw → swap → repay, which dips the health factor between steps.
3. `prepare_position_swap` with the quoteId. It can ask for up to two prior signatures (an adapter approval and a position-manager approval): have the user sign exactly what the quote asks, pass the signatures back, and hand over the final typed data unsigned.
4. Present the quote — both sides' amounts, slippage, the resulting position — before anything is signed.

## Rules

- On v3 there is no atomic position swap: say so, and spell out the manual sequence's health-factor risk instead of improvising one.
- Amounts in main units; `slippagePct` caps slippage, omitting accepts the backend suggestion.
