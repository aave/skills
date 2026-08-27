# Aave MCP plugin

Connect a coding agent to Aave's official MCP server at
[`mcp.aave.com`](https://mcp.aave.com). The plugin covers live Aave V3 and V4 markets, public wallet
positions and health factors, DAO governance, rewards, and non-custodial transaction preparation.

## Example prompts

- “Compare the current USDC supply APY on Aave V3 and V4 on Ethereum.”
- “Show the Aave positions and health factor for `0x…`.”
- “Which Aave governance proposals are currently open for voting?”
- “Preview supplying 500 USDC to Aave V4 for `0x…`.”

## Safety

The server never receives private keys. Read and `prepare_*` tools return public data, simulations,
unsigned transactions, or typed data for the user's own wallet to review and sign. Review all wallet
requests before signing.

## Data handling

Wallet addresses supplied in prompts or tool calls are public blockchain identifiers. The service may
process wallet addresses, MCP session identifiers, client/user-agent metadata, tool usage, and an
optional tool-call rationale for reliability and product analytics. Do not include private keys,
seed phrases, access tokens, or other secrets in prompts or tool arguments.

- [Privacy policy](https://aave.com/privacy-policy)
- [Terms of service](https://aave.com/terms-of-service)

## Support

- [Documentation](https://github.com/aave/skills)
- [Report an issue](https://github.com/aave/skills/issues)
