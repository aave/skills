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

Two tools send something on: `submit_signed_order` relays an order the user already signed, and
`cancel_order` relays a signed cancellation. Neither can change what the signature covers. They are
the only tools not marked read-only, so a host that asks before write-capable tools, such as Hermes,
asks before either one runs.

## Data handling

Every tool call goes to `mcp.aave.com`, which records tool usage for reliability and product
analytics: the tool called and its outcome, the MCP session identifier, and the client name and
user agent. A wallet address in a tool call is recorded only as a keyed hash, and addresses are
removed from everything else that is recorded. Wallet addresses are public blockchain identifiers.
Do not include private keys, seed phrases, access tokens, or other secrets in prompts or tool
arguments.

- [Privacy policy](https://aave.com/privacy-policy)
- [Terms of service](https://aave.com/terms-of-service)

## Support

- [Documentation](https://github.com/aave/skills)
- [Report an issue](https://github.com/aave/skills/issues)
