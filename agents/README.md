# Community Agents

A collection of ready-to-use agents for SuperClawd, created and maintained by the community.

## How to Use

### Option 1: Import via SuperClawd App

1. Browse the agents below and find one you like
2. Click the agent file to view it on GitHub
3. Click "Raw" to get the raw JSON
4. Copy the JSON content
5. In SuperClawd, go to **Agents** → **Import**
6. Paste or drag-drop the JSON file
7. Done! The agent is now in your workspace

### Option 2: Download and Import

1. Download the `.json` file
2. In SuperClawd, go to **Agents** → **Import**
3. Drag and drop the file
4. Done!

## Agent JSON Format

An exported agent is identity + content only — no server-managed state (ids, counts, enabled flags). It carries:

- **name** — kebab-case identifier, max 30 chars (auto-converted on import if needed)
- **description** — optional summary, max 250 chars
- **vendor** / **model** — the provider (e.g. `anthropic`) and model id
- **prompt** — the agent system prompt
- **mode** — `subagent` or `primary`
- **tools** — per-tool permissions (`allow` / `deny` / `ask`) for read, glob, grep, edit, write, bash, webfetch, task
- **steps** — optional max step budget (1–1000)

See the [Contributing Guide](../CONTRIBUTING.md) for the full JSON format.

## Available Agents

### Code Review

| Agent | Mode | Description |
|-------|------|-------------|
| [code-reviewer.json](./examples/code-reviewer.json) | Subagent | Reviews PRs for correctness, tests, security, and readability (read-only) |

### Documentation

| Agent | Mode | Description |
|-------|------|-------------|
| [docs-writer.json](./examples/docs-writer.json) | Subagent | Drafts and updates technical docs, READMEs, and guides from source |

### Testing

| Agent | Mode | Description |
|-------|------|-------------|
| [test-runner.json](./examples/test-runner.json) | Subagent | Runs the test suite, diagnoses failures, and proposes targeted fixes |

## Contributing

Have an agent to share? See our [Contributing Guide](../CONTRIBUTING.md) to submit a PR!

## Agent Requests

Want an agent that doesn't exist? Open a [Discussion](https://github.com/superclawd-ai/superclawd/discussions) in the **Ideas** category.
