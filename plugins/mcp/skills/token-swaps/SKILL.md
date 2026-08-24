---
name: token-swaps
description: Token swaps through Aave — read this before any get_swap_quote or prepare_swap call: chain coverage, sell vs buy kinds, intent vs transaction routes, relaying and tracking orders — for "swap X for Y", "quote a swap", converting a token, or a swap's status.
---

# Aave token swaps

Swaps are protocol-agnostic but run on the v4 backend: only the chains that backend serves can be quoted. Non-custodial throughout — the user signs everything; `submit_signed_swap` and `cancel_swap` only relay signatures.

## Steps

1. Coverage first: `get_swappable_tokens` with no arguments for the per-chain sweep, or read `canSwapFrom` on a `get_markets` row. Quote only on covered chains — an uncovered chain is rejected, not badly quoted. A chain listed with 0 swappable tokens is a real "nothing can be swapped here".
2. `get_swap_quote` — amounts in main units; `kind: "sell"` spends an exact amount, `"buy"` receives one. Pass `slippagePct` to cap slippage; omitting accepts the backend's suggestion, which moves with market conditions.
3. `prepare_swap` with the quoteId, and check `__typename`: an ERC-20 sell returns EIP-712 typed data (route `intent`) the user signs for you to relay with `submit_signed_swap`; a native-token sell returns a transaction (route `transaction`) the user sends themselves — nothing to relay.
4. Present the quote — rate, amounts both sides, slippage cap, route — before the user signs anything. `submit_signed_swap` posts the order and is state-changing.

## Rules

- A submitted intent is an open order, not a completed swap: report completion from `get_swap_status`, never from submission success. `cancel_swap` needs the user's cancellation signature.
- Approval permits appear only when a quote offers one (`bySignature`): never pass `permitSignature` on a first call.
