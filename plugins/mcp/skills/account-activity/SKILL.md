---
name: account-activity
description: An Aave account's history — past supplies, borrows, repays, withdrawals and collateral changes, and how net worth or health factor moved over time — for "what did this wallet do", "transaction history", "how has my position changed".
---

# Aave account activity

## Steps

1. `get_user_activity` for the event feed, most recent first. v4 covers every chain in one read; v3 reads one market on one chain at a time and states that scope — so on v3, sweep the markets the wallet actually holds (from `get_user_positions`) rather than treating one market's page as the full history.
2. Position trajectory: `get_user_summary_history` (v4) for net worth, debt and health factor over a window — the "how close to liquidation have I been" question.
3. Paging: pass `pageInfo.next` back as `cursor` with an explicit version — a cursor belongs to one version's feed.

## Reporting rules

- State the scope of any v3 history answer (which market, which chain); never present one market's page as the wallet's complete history.
- "Where does this wallet hold anything" is `get_user_positions`, not this feed.
