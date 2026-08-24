---
name: governance
description: Research Aave DAO governance — live, queued or past proposals, whether one passed and where its payloads executed, vote tallies, how a wallet voted — for any "AIP", "proposal", or "did the DAO…" question.
---

# Aave governance research

Governance is DAO-level: no v3/v4 version argument applies anywhere here.

## Steps

1. `search_governance_proposals` — `state: "active"` answers "what is live", `queued` answers "what is waiting to execute"; `search` for topics. Add `includeSummaries` only when summarising a list.
2. `get_governance_proposal` for one proposal's detail. `includeDescription: true` only when the full write-up is needed — it runs to many KB.
3. Execution questions: `get_proposal_payloads` — one payload per target chain, each with its own state.
4. Voting questions: `get_proposal_votes` (largest voter first; `totals` covers every vote, not just the page). One wallet: `get_user_vote` — `voted: false` is an answer, not an error.

## Reporting rules

- Passing takes both `quorumMet` and `differentialMet` — report the two conditions, not a raw tally comparison.
- "Executed" is per chain: a proposal can be executed on mainnet while a payload is still queued elsewhere. Check payloads before saying a change is live everywhere.
- Tallies, quorum and voting power are all in AAVE, so they compare directly; convert to USD only when asked, naming the price source.
