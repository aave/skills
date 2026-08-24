# Aave skills

Aave plugins for coding agents.

## mcp

Aave's official MCP server, [mcp.aave.com](https://mcp.aave.com): live V3 and V4 markets, wallet
positions and health factor, DAO governance, and unsigned transactions your own wallet signs.

```
/plugin marketplace add aave/skills
/plugin install mcp@aave
```

Then ask "what's the health factor of `0x…`", "USDC supply APY, V3 or V4?", or "prepare a supply of
500 USDC for `0x…`". Tool list and per-client setup: [aave.com/docs/mcp](https://aave.com/docs/mcp).

Any MCP client can skip the plugin and point at the URL. `plugins/mcp/.mcp.json` is the config.

To install it for a whole repo, commit to `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "aave": { "source": { "source": "github", "repo": "aave/skills" } }
  },
  "enabledPlugins": { "mcp@aave": true }
}
```

### Skills

The plugin ships twelve skills the agent reaches on its own:

- `position-health` — wallet review: health factor, liquidation distance, per-market reporting.
- `safe-transactions` — supply / borrow / withdraw / repay with the discover → simulate → build discipline.
- `yield-analysis` — cross-chain, cross-version rate comparison that states what it covered.
- `governance` — proposals, payload execution per chain, vote tallies and wallet votes.
- `token-swaps` — quote → sign → relay → track, on the chains the swap backend serves.
- `position-swaps` — v4 atomic collateral swaps, debt swaps, and repay-from-collateral.
- `emode` — v3 efficiency mode: categories, the LTV trade-off, switching safely.
- `rewards` — claimable incentives across protocol and Merit, and the claim path per version.
- `gho-savings` — sGHO deposits and share-denominated withdrawals, stkGHO migration.
- `account-activity` — event history and position trajectory, with honest v3 scope.
- `market-structure` — chains, hubs and spokes: where liquidity sits vs where users act.
- `liquidations` — eligibility (health factor < 1), selectors, and the unsigned call.

## Other agents

Codex and any other MCP client can use the same server without the plugin. Point the client at it —
Codex CLI:

```toml
# ~/.codex/config.toml
[mcp_servers.aave]
url = "https://mcp.aave.com"
```

— and copy [`plugins/mcp/AGENTS.md`](plugins/mcp/AGENTS.md), the same workflow rules in the
`AGENTS.md` format those agents read, into your project root:

```
curl -O https://raw.githubusercontent.com/aave/skills/main/plugins/mcp/AGENTS.md
```

## Updates

`/plugin marketplace update aave`, or turn auto-update on under `/plugin`. Plugins carry no pinned
version, so they track `main`.

## Contributing

PRs welcome. Run `claude plugin validate .` first.

## License

MIT, see [LICENSE](LICENSE). This repo is the plugin manifest only; it points at
[mcp.aave.com](https://mcp.aave.com), whose server implementation is licensed separately.
