---
type: llm
weight: 1
focus: last_message
---

The answer hands over an unsigned transaction and says plainly that nothing has been sent and that the user's own wallet signs it. It states whether this supply counts as borrowing collateral and explains the consequence either way: without collateral enabled the deposit earns yield but backs no borrow. An answer that presents a hash, or claims the supply was executed, fails. If the simulation returns an error-level warning, saying so and building nothing is the correct outcome and passes instead.
