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

## Updates

`/plugin marketplace update aave`, or turn auto-update on under `/plugin`. Releases use semantic
versioning, beginning with `1.0.0`.

## Support, privacy, and terms

- Documentation: [github.com/aave/skills](https://github.com/aave/skills)
- Support: [GitHub issues](https://github.com/aave/skills/issues)
- Privacy: [aave.com/privacy-policy](https://aave.com/privacy-policy)
- Terms: [aave.com/terms-of-service](https://aave.com/terms-of-service)

## Contributing

PRs welcome. Run `claude plugin validate .` first.

## License

MIT, see [LICENSE](LICENSE). This repo is the plugin manifest only; it points at
[mcp.aave.com](https://mcp.aave.com), whose server implementation is licensed separately.
