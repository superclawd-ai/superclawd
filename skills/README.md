# Community Skills

A collection of ready-to-use skills for SuperClawd, created and maintained by the community.

## How to Use

### Option 1: Import via SuperClawd App

1. Browse the skills below and find one you like
2. Click the skill file to view it on GitHub
3. Click "Raw" to get the raw JSON
4. Copy the JSON content
5. In SuperClawd, go to **Skills** → **Import**
6. Paste or drag-drop the JSON file
7. Done! The skill is now in your workspace

### Option 2: Download and Import

1. Download the `.json` file
2. In SuperClawd, go to **Skills** → **Import**
3. Drag and drop the file
4. Done!

## Skill Formats

Skills come in two formats — both import the same way:

- **Structured** — instructions organized into categories (the `categories` array).
- **Markdown** — a single free-form markdown `body` (set `"format": "markdown"`).

See the [Contributing Guide](../CONTRIBUTING.md#skill-json-format) for the full JSON format of each.

## Available Skills

### React

| Skill | Format | Description |
|-------|--------|-------------|
| [react-best-practices.json](./examples/react-best-practices.json) | Structured | Component patterns, hooks, and React conventions |

### TypeScript

| Skill | Format | Description |
|-------|--------|-------------|
| [typescript-strict.json](./examples/typescript-strict.json) | Structured | Strict TypeScript guidelines for type-safe code |

### Code Review

| Skill | Format | Description |
|-------|--------|-------------|
| [code-review-checklist.json](./examples/code-review-checklist.json) | Markdown | A free-form checklist for thorough, consistent code reviews |

## Contributing

Have a skill to share? See our [Contributing Guide](../CONTRIBUTING.md) to submit a PR!

## Skill Requests

Want a skill that doesn't exist? Open a [Discussion](https://github.com/superclawd-ai/superclawd/discussions) in the **Ideas** category.
