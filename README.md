# Aave skills

Aave plugins for coding agents.

## Aave MCP

Aave's official MCP server, [mcp.aave.com](https://mcp.aave.com): live V3 and V4 markets, wallet
positions and health factor, DAO governance, and unsigned transactions your own wallet signs.

```
/plugin marketplace add aave/skills
/plugin install aave-mcp@aave
```

Then ask "what's the health factor of `0x…`", "USDC supply APY, V3 or V4?", or "prepare a supply of
500 USDC for `0x…`". Setup and marketplace documentation are maintained in this repository.

Any MCP client can skip the plugin and point at the URL. `plugins/mcp/.mcp.json` is the config.

Once the plugin is accepted into Anthropic's official directory, it will also install with:

```
/plugin install aave-mcp@claude-plugins-official
```

To install the independent marketplace version for a whole repo, commit to `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "aave": { "source": { "source": "github", "repo": "aave/skills" } }
  },
  "enabledPlugins": { "aave-mcp@aave": true }
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

`/plugin marketplace update aave`, or turn auto-update on under `/plugin`. Releases use semantic
versioning, beginning with `1.0.0`.

## Support, privacy, and terms

- Documentation: [github.com/aave/skills](https://github.com/aave/skills)
- Support: [GitHub issues](https://github.com/aave/skills/issues)
- Privacy: [aave.com/privacy-policy](https://aave.com/privacy-policy)
- Terms: [aave.com/terms-of-service](https://aave.com/terms-of-service)

## Contributing

Skill proposals and corrections are welcome. [CONTRIBUTING.md](CONTRIBUTING.md) covers what a
proposal needs and the checks to run first.

## License

MIT, see [LICENSE](LICENSE). This repo is the plugin manifest only; it points at
[mcp.aave.com](https://mcp.aave.com), whose server implementation is licensed separately.
