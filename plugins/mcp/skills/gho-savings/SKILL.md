---
name: gho-savings
description: GHO savings — deposit into or withdraw from the sGHO vault, its target rate and caps, migrating stkGHO out of the Safety Module — for "stake GHO", "sGHO", "GHO savings rate", "move my stkGHO".
---

# GHO savings (sGHO)

v3 tools, Ethereum only. sGHO pays a governance-set target rate — it does not move with utilisation — and it is not Aave collateral: present it as savings, never as a lending position. Deposits and withdrawals are instant, with no cooldown.

## Steps

1. `get_sgho_vault`, passing `user` for their shares, their GHO value, wallet balance, and the max deposit / withdraw the contract allows right now. Check `paused` and the supply cap before promising a deposit.
2. Withdrawals are denominated in sGHO SHARES, not GHO: convert a GHO figure with `get_sgho_preview` (action `withdraw`) first — passing GHO straight to the prepare withdraws the wrong amount. `max: true` redeems everything and skips the conversion.
3. `prepare_sgho_action`. When the result is ApprovalRequired (a deposit needs a GHO allowance), the `approval` transaction goes first, then the `originalTransaction` beside it. Unsigned; the user signs.
4. stkGHO → sGHO migration: `prepare_stkgho_migrate` moves the entire stkGHO position — it takes no amount — and this server cannot read stkGHO balances. Say both, and have the user check the position size in their wallet before signing.
