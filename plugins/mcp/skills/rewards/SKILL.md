---
name: rewards
description: Aave rewards — read this before any rewards question or get_user_rewards call: claimables across protocol and Merit programmes, and the claim path difference between v3 and v4 — for "unclaimed rewards", "claim my rewards", "incentives", "Merit".
---

# Aave rewards

## Steps

1. `get_user_rewards` with the wallet, no `chainId`, version `all` — one call covers both versions and every chain served, and includes Merit-distributed programmes: a GHO or sGHO incentive shows up here, not somewhere separate.
2. Claiming: on v3 the claim transaction is already in that response — use it, there is no second call. On v4, `prepare_claim_rewards` (omit `ids` to claim everything claimable).
3. Present the unsigned transactions per chain with what each claims; the user signs.

## Reporting rules

- Report rewards per chain using each row's own `chainId`; a chain under `chainsNotServed` is "no data here", not "no rewards".
- An empty result for a wallet with positions is a real answer: say "nothing claimable right now", not "no rewards programme exists".
