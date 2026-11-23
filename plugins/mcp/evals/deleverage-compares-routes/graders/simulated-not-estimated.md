---
type: llm
weight: 1
focus: last_message
---

The answer names the routes it considered out of the position (repay from wallet, repay from collateral, add collateral, or the subset the wallet actually allows) and gives a resulting health factor for the route it recommends. Each such figure is either taken from a simulation run in this session, or labelled explicitly as derived or not simulated. A figure presented as a simulated result when no simulation produced it fails, a recommendation with no resulting health factor at all fails, and proposing to withdraw collateral as a way to reduce liquidation risk without saying that this lowers the health factor first fails.
