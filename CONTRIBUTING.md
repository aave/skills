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

Run the comparison so the skill is the only difference between the two arms:

- Both arms against `mcp.aave.com`, with the same model, and more than one attempt each. A single
  run tells you very little about a change in behaviour.
- Repeat the pair on a small model. The plugin loads into every client whatever model sits behind
  it, and a flow a large model handles bare is often the one a small model gets wrong, so the
  small-model run decides as much as the other.
- Give neither arm anything beyond the server: no shell, no file tools, no other skills. A skill
  that only wins because the bare agent had `curl` has not won.
- Use a wallet that holds a live position, stated in the prompt. Against an empty wallet, "no
  position" is the right answer to everything, so every skill passes trivially, and an agent given
  no address at all will sometimes invent one.

Two things get proposals turned down more than anything else. A skill that restates what the tool
descriptions already say costs context on every turn and buys nothing, because every skill's
description is loaded whether or not it fires. And a skill written for a flow the tools already
handle correctly is a fix for a problem that is not there. The test for both is the transcript: the
same tool sequence and the same answer in both arms drops the skill, and no cost figure argues it
back in. A skill that fired and still changed nothing fails the same way, so what gets judged is
the sequence, never whether the skill loaded.

## Skill format

Skills follow the [Agent Skills specification](https://agentskills.io/specification). In this
repository:

- One directory per skill under `plugins/mcp/skills/`, holding a single `SKILL.md`.
- The directory name is the skill's `name`, and the two have to match.
- Frontmatter carries `name` and `description`, each a single line.
- The `description` decides when the skill fires, so write it around what a user would ask, not
  around what the skill contains. If the skill exists to precede one tool call, name that tool in
  the description too: one that only names the topic often never fires.
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

Whichever way it lands, file the failing bare-arm sequence as an issue on
[aave/mcp](https://github.com/aave/mcp). A sequence the bare agent got wrong is a tool-description
bug first, and evidence for a skill second.

## A merged skill does not stay merged

The server's descriptions keep absorbing the lessons skills carry. After a server release, the
comparisons for the skills shipped here get re-run, and a skill whose two arms now match is
deleted. The set should shrink over time, not grow.

## Licence

Contributions are accepted under the MIT licence, the same one this repository carries. See
[LICENSE](LICENSE).
