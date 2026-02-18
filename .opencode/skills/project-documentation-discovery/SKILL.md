---
name: project-documentation-discovery
description: This skill allow incremental discovery of how osu-tournament-manager works
---

# What I Do

- Prevents information overload and guides through available project documentation for specific task that might need the additional context

# When to Use Me

- When working on a task that requires understanding project structure
- When exploring architecture or configuration details
- When needing context about how components interact
- When Implementing modifications on codebase and want to understand coding conventions

# Discovery Strategy

## Proactive, Lightweight Discovery Approach

1. Start with main entry point `/documentation/README.md` to understand available categories
2. Consume only what's needed - Don't read all documentation upfront; navigate selectively based on task requirements
3. Navigation strategy:
   - Identify relevant category (Architecture, Environment, Coding conventions or Installation)
   - Read that section's README for guidance
   - Move deeper into specific docs only when needed
4. Avoid information overload - Section READMEs act as gatekeepers; navigate progressively
5. Task-based navigation:
   - **Understanding system design** → Start `architecture/README.md`, drill into specific components as needed
   - **Understanding configuration** → Start `environment-files/README.md`, check specific app configs as needed
   - **Setting up project** → Start `installation/README.md`, follow step-by-step as needed
   - **Coding standards** → Start `coding-conventions/README.md`, refer to specific guidelines as needed
6. Reference code paths - When documentation links to source code, use those for direct exploration
