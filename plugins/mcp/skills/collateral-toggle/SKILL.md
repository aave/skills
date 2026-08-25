---
name: collateral-toggle
description: Enable or disable a supplied asset as Aave collateral — "stop using X as collateral", "turn collateral on/off", "isolate my collateral" — only after simulating the health factor the change leaves behind.
---

# Aave collateral toggle

Disabling collateral is the one Aave action that can make a position liquidatable without moving a single token. It is never built without the health factor after.

## Steps

1. **Inspect** — `get_user_summary` then `get_user_positions` for the wallet. Note the current health factor and how much of the collateral value the asset in question provides.
2. **Simulate** — `preview_action` for the toggle where the server supports it; where it does not, compute the health factor after from the positions read: remove that asset's collateral value × its liquidation threshold from the numerator, and say that the figure is computed, not simulated.
3. **Refuse below 1.0** — if disabling would leave the health factor below 1.0, the protocol will reject it and the user should hear that before signing anything. Below 1.2, build it only if the user confirms they understand the margin.
4. **Build** — `prepare_set_collateral` with the selector read from `get_markets` in this session. Hand over unsigned with the health factor before and after.

## Rules

- Enabling collateral has no downside to the health factor and needs no confirmation beyond the read; disabling always does.
- v3 isolation mode: an isolated asset can be the only collateral; say so when the toggle would violate that.
- No debt means no health factor: disabling is then free, and the answer should say why.

## Done when

- The health factor before and after is in the answer, labelled simulated or computed.
- A disable that would drop below 1.0 was refused with the reason; one below 1.2 was flagged.
- The transaction is presented unsigned.
