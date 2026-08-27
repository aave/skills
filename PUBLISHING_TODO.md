# Aave MCP marketplace publishing TODO

Target plugin slug and initial release: **`aave-mcp` `1.0.0`**.

## Completed in this branch

- [x] Rename the Claude and Cursor plugin slug to `aave-mcp`.
- [x] Add `1.0.0` to the Claude plugin, Claude marketplace, Cursor plugin, and Cursor marketplace.
- [x] Add the Cursor marketplace manifest, plugin manifest, and remote `mcp.json`.
- [x] Add a repository-hosted logo, plugin README, changelog, support URL, privacy URL, terms URL,
      and four reviewer-ready example prompts.
- [x] Document MCP data handling and the non-custodial signing boundary.
- [x] Configure the MCP implementation package as `@aave/mcp` `1.0.0` for the public npm registry.
- [x] Change the MCP Registry server identity to `com.aave/mcp` `1.0.0`.

## Marketplace policy verification — launch blocking

- [ ] **OpenAI:** obtain a written determination on which transaction-related tools may be included.
      In particular, verify `submit_signed_swap`, `cancel_swap`, and all `prepare_*` tools against the
      prohibition on plugins that facilitate or meaningfully enable execution of money transfers,
      crypto transfers, or investment trades.
      Source: [OpenAI Plugin guidelines](https://developers.openai.com/plugins/app-guidelines),
      “Prohibited fraudulent, deceptive, or high-risk services.”
- [ ] **Anthropic:** obtain written permission or confirmation for the same tool surface. Anthropic's
      Software Directory Policy lists software that transfers money or cryptocurrency, or executes
      financial transactions for users, as unsupported unless expressly permitted in writing.
      Source: [Anthropic Software Directory Policy §4](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy).
- [ ] If either marketplace does not approve the full surface, deploy a separately allowlisted,
      informational endpoint and point only that marketplace's manifest/submission at it.

## Shared production readiness

- [ ] Set explicit `readOnlyHint`, `openWorldHint`, and `destructiveHint` values on every MCP tool and
      verify the values against each marketplace's scanner.
- [ ] Decide whether MCP Amplitude analytics requires explicit consent or an MCP-specific opt-out.
      Ensure production behavior matches the published privacy policy before submission.
- [ ] Add production rate limiting, abuse controls, uptime alerts, and an incident/support owner.
- [x] Use the public `aave/skills` repository as the initial plugin documentation and homepage.
- [ ] Publish a canonical Aave MCP documentation page and replace the temporary GitHub homepage when ready.
- [ ] Confirm GitHub Issues is the intended public support channel, or replace it with the approved
      Aave support URL/email in all manifests and READMEs.
- [ ] Run MCP protocol tests and evals against the exact production endpoint submitted to each directory.

## Claude official directory

- [ ] Run `claude plugin validate .` from this repository and resolve every warning.
- [ ] Test `claude --plugin-dir ./plugins/mcp`, including successful reads and safe error behavior.
- [ ] Verify the four example prompts against production.
- [x] Reviewer test credentials are not required while the endpoint remains public and unauthenticated.
- [ ] Accept the Anthropic Software Directory Terms and submit the public GitHub repository at
      <https://claude.ai/settings/plugins/submit> or <https://platform.claude.com/plugins/submit>.
- [ ] Confirm the final official install command:
      `/plugin install aave-mcp@claude-plugins-official`.

Submission requirements:
[Anthropic plugin submission documentation](https://claude.com/docs/plugins/submit).

## Cursor Marketplace

- [ ] Load `plugins/mcp` from `~/.cursor/plugins/local/aave-mcp` and test installation plus MCP calls.
- [ ] Validate all relative paths, metadata, logo rendering, README links, and MIT licensing.
- [ ] Accept the Cursor Marketplace Publisher Terms.
- [ ] Submit <https://github.com/aave/skills> at <https://cursor.com/marketplace/publish>.
- [ ] Address manual security, data-handling, and quality review feedback.

Submission requirements:
[Cursor plugin checklist](https://cursor.com/docs/reference/plugins#submitting-a-plugin).

## OpenAI Plugins Directory

- [ ] Business verification and Apps Management permissions are handled separately by the submitter.
- [ ] Complete the policy determination above before scanning or submitting the MCP endpoint.
- [ ] Prepare five positive tests and three negative tests with expected result shapes.
- [ ] Complete domain verification, Scan Tools, annotations, listing metadata, country availability,
      release notes, and policy attestations in <https://platform.openai.com/plugins>.

Submission requirements:
[OpenAI plugin submission documentation](https://developers.openai.com/plugins/deploy/submission).

## npm and official MCP Registry

- [ ] Confirm the `@aave/mcp` package name is available and the release operator has publish access to
      the `@aave` npm organization.
- [ ] Run `npm pack --dry-run`, inspect the package contents, and publish `@aave/mcp@1.0.0` with npm
      provenance.
- [ ] Generate the MCP Registry domain-auth key outside git and add the required proof record to the
      **`aave.com` apex**. The reverse-DNS namespace is `com.aave`.
- [ ] Run `mcp-publisher validate`, then authenticate with
      `mcp-publisher login dns --domain aave.com ...` and publish `com.aave/mcp`.
- [ ] Verify the published record through the official MCP Registry API.

Registry references:
[publisher commands](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/cli/commands.md)
and [domain authentication](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/authentication.mdx).
