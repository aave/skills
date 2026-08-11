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
500 USDC for `0x…`". Tool list and per-client setup: [aave/mcp](https://github.com/aave/mcp).

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

## Updates

`/plugin marketplace update aave`, or turn auto-update on under `/plugin`. Plugins carry no pinned
version, so they track `main`.

## Contributing

PRs welcome. Run `claude plugin validate .` first.

## License

Business Source License, see [LICENSE](LICENSE). As a customized license, BUSL uses the `LicenseRef-` prefix per [SPDX Spec v2.3, Annex E](https://spdx.github.io/spdx-spec/v2.3/using-SPDX-short-identifiers-in-source-files/).
