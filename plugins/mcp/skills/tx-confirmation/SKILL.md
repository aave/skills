---
name: tx-confirmation
description: Confirm what an Aave transaction did after the user signed it — "did it go through", "was my supply processed", "check my transaction" — by reading the position it left behind and comparing with what was simulated.
---

# Aave transaction confirmation

Every tool named below comes from Aave's MCP server, `https://mcp.aave.com`. If `get_markets` is not
available, add it first: `claude mcp add --transport http aave https://mcp.aave.com` (Claude Code),
`codex mcp add aave --url https://mcp.aave.com` (Codex), or point any other MCP client at the URL.

A transaction hash is not a result. The result is the position after, compared with the position that was simulated before.

## Steps

1. **Find it in the feed** — `get_user_activity` for the wallet, on the chain the transaction was sent to (v3 reads one market per call, so pass `chainId`). The matching `txHash` row gives the action, the asset and the amount as Aave indexed them. A hash that is not in the feed has not been processed by the protocol yet — or reverted, or was never mined.
2. **Read the position** — `get_user_summary` and `get_user_positions` for the wallet. The health factor and the balances the action should have changed are the confirmation.
3. **Compare** with the simulation from earlier in the conversation, if there was one: the `healthFactorAfter` it reported against the health factor now, the amount built against the balance change. A gap larger than accrued interest and price movement is worth naming.
4. **Clear the next step** — if a later step in the plan depended on this one (an approval before an action, a repay before a withdraw), the confirmation is what clears it. On v4, `get_transaction_processed` exists for exactly this: pass the hash and the `operations` array the build returned, and poll until `processed` is true before building the dependent step. It is v4-only and needs those operations; it does not look up an arbitrary hash.

## Rules

- Do not report success from the hash alone; the position read is the confirmation.
- A transaction that reverted or was never mined leaves the position unchanged: say that plainly, and that nothing was spent beyond gas.
- Aave's feed reads current state and history; it does not carry a receipt, block or gas figure. Where the user wants those, say they come from a block explorer, not from here.
- No signing here: this skill only reads.

## Done when

- The answer states whether the protocol has indexed the transaction, and the position's health factor and changed balances after it.
- Where a simulation preceded it, the answer compares simulated against actual.
- Where a dependent step was waiting, the answer says it can now be built.
