# Contributing

This repository holds the Aave plugin manifests and the skills that ship with them. The MCP server
itself lives in [aave/mcp](https://github.com/aave/mcp), and the skills here are also published by
that server, so a change made here reaches both.

## Proposing a skill

A skill is a procedure for one flow: which tools to call, in what order, and what a finished answer
has to contain. It earns its place by changing what an agent actually does, so a proposal is judged
on that rather than on how it reads.

Include in the pull request:

- **The prompt**, phrased the way a user would type it.
- **What the agent did without the skill**, as the sequence of MCP tools it called.
- **What it did with the skill**, the same way.
- **Why the difference matters**, in a sentence. A missing read, a step taken in the wrong order, or
  a number reported without the context that qualifies it.

Run both arms against `mcp.aave.com` with the same model, and give each more than one attempt: a
single run tells you very little about a change in behaviour.

Two things get proposals turned down more than anything else. A skill that restates what the tool
descriptions already say costs context on every turn and buys nothing, because every skill's
description is loaded whether or not it fires. And a skill written for a flow the tools already
handle correctly is a fix for a problem that is not there.

## Skill format

Skills follow the [Agent Skills specification](https://agentskills.io/specification). In this
repository:

- One directory per skill under `plugins/mcp/skills/`, holding a single `SKILL.md`.
- The directory name is the skill's `name`, and the two have to match.
- Frontmatter carries `name` and `description`, each a single line.
- The `description` decides when the skill fires, so write it around what a user would ask, not
  around what the skill contains.
- Name only tools the server actually serves. `tools/list` on `mcp.aave.com` is the inventory, and a
  skill naming a tool that does not exist is rejected by the server's own test suite.

Keep the body short. It is read by a model mid-task, not by someone browsing.

## Before opening a pull request

```bash
claude plugin validate .
```

## When the change belongs in the server instead

If a lesson holds generally rather than for one flow, it usually belongs in a tool description in
[aave/mcp](https://github.com/aave/mcp), where every client gets it and nothing is paid for it on
turns where it does not apply. That is a change worth making, and worth proposing there instead.

## Licence

Contributions are accepted under the MIT licence, the same one this repository carries. See
[LICENSE](LICENSE).
