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

The plugin ships five skills the agent reaches on its own when a request matches:

- `safe-transactions` — supply, borrow, withdraw or repay: reads the position, simulates the exact action, then builds it and hands it over unsigned with the health factor after.
- `deleverage` — lift a health factor: repay from wallet, repay from collateral, or add collateral — each route simulated and compared on the result before one is recommended.
- `account-activity` — a wallet's Aave history and position over time, with the scope of every read stated.
- `yield-analysis` — supply and borrow rates across chains and versions, ranked only on rates you can actually enter, with the recent range beside the spot figure.
- `tx-confirmation` — what a signed transaction did, confirmed from the position it left behind rather than from the hash.

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
