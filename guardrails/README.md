# Community Guardrails

A collection of ready-to-use guardrails for SuperClawd, created and maintained by the community.

Guardrails are enforced workspace rules that intercept Claude Code tool calls (via PreToolUse hooks) and can **deny**, **ask** about, or **warn** on matching actions.

## How to Use

### Option 1: Import via SuperClawd App

1. Browse the guardrails below and find one you like
2. Click the guardrail file to view it on GitHub
3. Click "Raw" to get the raw JSON
4. Copy the JSON content
5. In SuperClawd, go to **Guardrails** → **Import**
6. Paste or drag-drop the JSON file
7. Done! The guardrail is now in your workspace

### Option 2: Download and Import

1. Download the `.json` file
2. In SuperClawd, go to **Guardrails** → **Import**
3. Drag and drop the file
4. Done!

## Guardrail Format

Each guardrail is a JSON object with this shape:

- **`name`** — kebab-case identifier (e.g. `block-force-push`).
- **`description`** — what the guardrail enforces.
- **`match`** — the conditions that trigger it:
  - **`tools`** (required) — tool names the guardrail applies to (e.g. `Bash`, `Edit`, `Write`).
  - **`pathGlobs`** (optional) — glob patterns matched against file paths.
  - **`commandPatterns`** (optional) — regex patterns matched against Bash commands.
  - **`contentPatterns`** (optional) — regex patterns matched against tool input content.
- **`action`** — `deny`, `ask`, or `warn`.
- **`message`** — shown to the user when the guardrail matches.
- **`presetId`** (optional) — identifier of a preset this guardrail was derived from.
- **`experimental`** (optional) — whether the guardrail is in experimental mode.

See the [Contributing Guide](../CONTRIBUTING.md) for full details.

## Available Guardrails

### Git

| Guardrail | Action | Description |
|-----------|--------|-------------|
| [examples/block-force-push.json](./examples/block-force-push.json) | deny | Blocks force pushes to git so history is never rewritten on shared branches |

### Secrets

| Guardrail | Action | Description |
|-----------|--------|-------------|
| [examples/protect-secrets.json](./examples/protect-secrets.json) | ask | Prevents edits to environment and credential files that commonly hold secrets |

### Database

| Guardrail | Action | Description |
|-----------|--------|-------------|
| [examples/protect-migrations.json](./examples/protect-migrations.json) | warn | Warns before editing already-applied database migration files |

## Contributing

Have a guardrail to share? See our [Contributing Guide](../CONTRIBUTING.md) to submit a PR!

## Guardrail Requests

Want a guardrail that doesn't exist? Open a [Discussion](https://github.com/superclawd-ai/superclawd/discussions) in the **Ideas** category.
