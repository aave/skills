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

The plugin ships five skills the agent reaches on its own. Eighteen were written; each was run headless with
and without the skill against live mcp.aave.com on three models (Fable 5, Sonnet 5, Haiku 4.5), and a skill
stays only while it changes the agent's tool sequence for the better on at least one of them. Thirteen have
been dropped; the last three (governance, market-structure, collateral-toggle) on 27 Aug 2026, after a
server update moved their one useful line into the tool descriptions on every model. Expect the list to
shrink further as the remaining lines land server-side — that is the intended direction.

- `safe-transactions` — supply / borrow / withdraw / repay with the discover → inspect → simulate → build discipline. Bare, every model builds a supply without reading the position; Sonnet never simulates.
- `deleverage` — lift a health factor: repay, repay from collateral, add collateral — every route simulated, none estimated. Bare, Fable guesses the health factor after; Haiku once proposed withdrawing collateral.
- `account-activity` — event history with honest v3 scope: positions first, sweep the markets the wallet holds, say whether the feed was read to its end. Bare, Haiku reports a wallet with a live Base position as inactive.
- `yield-analysis` — cross-chain, cross-version rate comparison that quotes the recent range beside the spot and says what it covered. Bare, Sonnet and Haiku rank on one `get_markets` call and never read the history.
- `tx-confirmation` — what a signed transaction did, read from the position it left, not from the hash. Bare, Haiku cannot find the transaction and sends the user to a block explorer.

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
