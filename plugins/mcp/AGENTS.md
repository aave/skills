# Aave MCP agent guide

How to work against [mcp.aave.com](https://mcp.aave.com), Aave's official MCP server, from any MCP client. Drop this file into your project root — Codex and most agents read `AGENTS.md` there.

## Workflow: discover → inspect → simulate → build

1. **Discover** — `get_markets`, narrowed with `symbols`, omitting `chainId` so one call covers every chain. Selectors (v4 `reserveId`; v3 `market` + `token` + `chainId`) come from this call in this session: they are deployment-specific and cannot be recalled or constructed.
2. **Inspect** — `get_user_summary` and `get_user_positions` for the wallet, `get_reserve_details` for the reserve.
3. **Simulate** — `preview_action` before building; mandatory before any borrow or withdraw. An error-level warning means the action cannot succeed — fix it rather than build it.
4. **Build** — `prepare_action` (or another `prepare_*`). Everything returned is unsigned; the user's own wallet signs and submits. Follow the plan in order — an approval step may precede the action — and confirm a sent transaction with `get_transaction_processed` before building one that depends on it.

## Rules that prevent real mistakes

- Amounts are in main units (`"10.5"` = 10.5 USDC), never base units or wei.
- Rates named with a `Pct` suffix are percents: `"3.32"` means 3.32%.
- Every successful response is `{ data, next_actions?, warnings? }`. Follow `next_actions`. Treat warnings by level — error: stop; warning: proceed but tell the user; info: context.
- Coverage: responses name the chains they read (`chainsCovered`). A chain under `chainsNotServed` holds no data on this API — an empty result there is not "zero".
- Health factor < 1.0 = liquidatable now. Health factors are per market (v3) / per position (v4) — never average them.
- A supply is not collateral unless enabled (`enableCollateral: true`); without collateral, borrowing power is zero and any borrow fails.
- When ranking yields: skip frozen/paused/cap-reached reserves, check available capacity against the intended size, and say whether the answer is a sample or the population.
