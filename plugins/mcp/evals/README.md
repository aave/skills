# Evals

A runnable form of the comparison [CONTRIBUTING.md](../../CONTRIBUTING.md) asks for: every case runs
twice, once with the plugin loaded and once against the bare server, and the report states the
score delta between the two arms.

## Running

```bash
claude plugin eval . \
  --ablation with-without \
  --allow-real-servers \
  --allow-tools 'mcp__plugin_aave-mcp_aave__*' \
  --trust-plugin \
  --no-scaffold --no-publish
```

`--runs 1 -j 3` for a quick pass, the default is three runs per case. Add `--json <path>` for the
machine-readable result and `--keep-temp` to keep each run's `trace.jsonl`.

## Cases

| Case | Asks | Graders | Would catch |
|---|---|---|---|
| `supply-reads-position` | Supply 0.1 ETH to V4 on Ethereum and hand over the transaction | `preview_action` ≥ 1, `get_user_summary` ≥ 1, plus an LLM rubric for an unsigned hand-off that states the collateral consequence | building a supply without reading the position, or without simulating it |
| `deleverage-compares-routes` | Reduce liquidation risk on a wallet carrying debt | `preview_action` ≥ 1, `prepare_action` = 0, plus an LLM rubric for a health factor per route, simulated or labelled as derived | estimating the resulting health factor, or recommending a route with no simulated value |
| `account-activity-states-scope` | Recent V3 history for a wallet | `get_user_activity` ≥ 1, plus an LLM rubric for a stated scope | presenting one market's page as the wallet's whole history |
| `tx-confirmation-reads-position` | Did this cbBTC supply go through | `get_user_activity` ≥ 1, `get_user_summary` ≥ 1, plus an LLM rubric confirming from the position | confirming from the hash alone, or answering with a block-explorer link |
| `yield-apy-history` | Which USDC supply APY is better on Ethereum, V3 or V4, and is today's rate typical for the month | `get_apy_history` ≥ 1, plus an LLM rubric for the recent range beside the spot rate | ranking on one `get_markets` call, quoting a spot rate with no range |
| `no-fire-protocol-question` | What is Aave, for someone new to DeFi | `prepare_action` = 0, plus an LLM rubric for a plain-language answer | a lending flow turning a conceptual question into a transaction build |

Every case removes the file tools, the shell and `Agent`, so an arm can answer only through the MCP
server. That is what makes the two arms comparable.

The two wallet addresses in the prompts are public onchain accounts taken from
`get_reserve_holders` on the V4 USDC reserve, so each case runs against a live position instead of an
empty wallet where every answer is trivially correct. The transaction hash is a real V4 cbBTC supply
from one of them. Replace the address when a position closes; the cases only assume the wallet holds
something.

## Reading the result

A run's score is the weighted fraction of its graders that passed. A case's `delta` is its score with
the plugin minus its score without, so a positive delta is the plugin changing the answer for the
better and a negative delta is it making the answer worse.

## Harness notes

- Tools from the plugin's server are namespaced `mcp__plugin_<plugin>_<server>__<tool>` inside a run,
  which is `mcp__plugin_aave-mcp_aave__*` here. A grader naming the bare `mcp__aave__<tool>` matches
  nothing and silently reports zero calls.
- `--allow-real-servers` is needed: this suite ships no mocks, and a server without a mock is not
  started.
- `--trust-plugin` is needed whenever no interactive terminal is attached (CI, `--json`).
- `disallowed_tools` does not apply inside sub-agents. `Agent` has to be listed there too, or the
  bare arm borrows the shell and file tools through a sub-agent and the comparison stops being an A/B.
- A `tool_used` grader with only `max: 0` is read as the range `[1, 0]` and can never pass. Write
  `min: 0` as well.
- Calls to `mcp.aave.com` can fail with `ECONNRESET` mid-run; the agent retries, so budget
  `timeout_seconds` for the retries rather than for the tool count.

## Relation to the method in CONTRIBUTING

CONTRIBUTING judges a skill on the MCP tool sequence each model produces, comparing arms per model
across repeats. This suite encodes the sequences that matter as `tool_used` and `tool_order`
assertions, so a sequence regression fails a case; the score delta then summarises the effect. The
transcripts themselves live in each run's `trace.jsonl` under `--keep-temp`.
