# Contributing to SuperClawd Community

Thanks for contributing! This guide explains how to submit skills, commands, and workflows.

- [Contributing Skills](#contributing-skills)
- [Contributing Commands](#contributing-commands)
- [Contributing Workflows](#contributing-workflows)

---

# Contributing Skills

This section explains how to submit skills for others to use.

## How to Contribute

### 1. Fork this repository

Click the "Fork" button at the top right of this page to create your own copy.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR-USERNAME/superclawd.git
cd superclawd
```

### 3. Create your skill file

Add your skill JSON file to the appropriate category folder:

```
skills/
├── react/
├── typescript/
├── python/
├── code-review/
├── testing/
├── devops/
├── security/
└── general/
```

If your category doesn't exist, create it!

### 4. Add your skill to the catalog

Update `skills/README.md` to include your skill in the **Available Skills** section:

1. Find or create the category section (e.g., `### React`, `### Python`)
2. Add a row to the table with your skill file and description

Example:
```markdown
### Python

| Skill | Description |
|-------|-------------|
| [fastapi-guidelines.json](./python/fastapi-guidelines.json) | Best practices for FastAPI development |
```

### 5. Submit a Pull Request

Push your changes and open a PR to the main repository.

## Skill JSON Format

A skill can be authored in one of two formats:

- **Structured** — instructions organized into categories. Set `"format": "structured"` (or omit `format` entirely — it defaults to structured).
- **Markdown** — a single free-form markdown `body`. Set `"format": "markdown"`.

Both import the same way in SuperClawd. Pick whichever fits your skill.

### Structured format

```json
{
  "name": "React Best Practices",
  "action": "code",
  "executionMode": "auto",
  "description": "Guidelines for writing clean, maintainable React code",
  "format": "structured",
  "categories": [
    {
      "name": "Component Structure",
      "description": "How to structure React components",
      "instructions": [
        {
          "content": "Use functional components with hooks instead of class components",
          "type": "direct"
        },
        {
          "content": "When creating a new component",
          "type": "conditional",
          "subInstructions": [
            "Use named exports instead of default exports",
            "Define props interface as ComponentNameProps",
            "Place the props interface directly above the component"
          ]
        }
      ]
    }
  ]
}
```

### Markdown format

```json
{
  "name": "Code Review Checklist",
  "action": "review",
  "executionMode": "auto",
  "description": "A free-form markdown checklist for thorough code reviews",
  "format": "markdown",
  "body": "# Code Review Checklist\n\n## Correctness\n- Does the change do what the PR says?\n- Are edge cases handled?\n\n## Tests\n- Is new behavior covered by tests?\n"
}
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Skill name (1-40 characters) |
| `action` | Yes | One of: `analyze`, `plan`, `design`, `code`, `test`, `review`, `debug`, `commit`, `deploy`, `write`, `behave` |
| `executionMode` | Yes | `auto` or `always` |
| `description` | Yes | Brief description of the skill (1-250 characters) |
| `format` | No | `structured` (default) or `markdown` |
| `categories` | Structured only | Array of instruction categories (1-10) |
| `body` | Markdown only | Free-form markdown content (1-12,000 characters) |

> A structured skill uses `categories` (and must not include `body`); a markdown skill uses `body` (and must not include `categories`).

### Category Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Category name |
| `description` | No | What this category covers |
| `instructions` | Yes | Array of instructions |

### Instruction Types

**Direct instructions** - Always apply:
```json
{
  "content": "Use TypeScript for all files",
  "type": "direct"
}
```

**Conditional instructions** - Apply in specific situations:
```json
{
  "content": "When handling errors",
  "type": "conditional",
  "subInstructions": [
    "Log the error with context",
    "Return a user-friendly message",
    "Never expose stack traces in production"
  ]
}
```

## File Naming

Use kebab-case for file names:
- `react-best-practices.json`
- `typescript-strict-mode.json`
- `python-fastapi-guidelines.json`

## Quality Guidelines

Before submitting, ensure your skill:

- [ ] Has a clear, descriptive name
- [ ] Uses the correct JSON format
- [ ] Contains actionable instructions (not vague suggestions)
- [ ] Doesn't duplicate existing skills
- [ ] Is tested by importing into SuperClawd
- [ ] Is added to `skills/README.md` catalog

## Testing Your Skill

1. Go to your SuperClawd workspace
2. Navigate to Skills
3. Click "Import" and upload your JSON file
4. Verify all categories and instructions imported correctly

## Review Process

1. Submit your PR
2. Maintainers review for format and quality
3. Feedback provided if changes needed
4. Once approved, your skill is merged and available to everyone!

## License

By contributing, you agree that your skill will be shared under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), allowing others to use and adapt it with attribution.

## Questions?

Open a [Discussion](https://github.com/superclawd-ai/superclawd/discussions) if you need help!

---

# Contributing Commands

This section explains how to submit slash commands for others to use.

## How to Contribute Commands

### 1. Fork this repository

Click the "Fork" button at the top right of this page.

### 2. Create your command file

Add your command JSON file to `commands/examples/`:

```
commands/
└── examples/
    └── your-command.json
```

### 3. Add to the catalog

Update `commands/README.md` to include your command in the **Available Commands** table.

### 4. Submit a Pull Request

Push your changes and open a PR.

## Command JSON Format

```json
{
  "name": "security-review",
  "description": "Perform a comprehensive security review",
  "content": "Review the code for security vulnerabilities...",
  "arguments": [
    {
      "name": "focus-area",
      "description": "Specific area to focus on",
      "required": false
    }
  ]
}
```

### Field Reference

| Field | Required | Description | Limits |
|-------|----------|-------------|--------|
| `name` | Yes | Command name in kebab-case | 1-30 chars |
| `description` | Yes | Brief description | 1-100 chars |
| `content` | Yes | The command prompt | 1-2000 chars |
| `arguments` | No | Optional arguments | Max 3 |

### Argument Fields

| Field | Required | Description | Limits |
|-------|----------|-------------|--------|
| `name` | Yes | Argument name in kebab-case | 1-30 chars |
| `description` | No | What the argument is for | Max 100 chars |
| `required` | No | Whether the argument is required | boolean |

## File Naming

Use kebab-case for file names:
- `security-review.json`
- `code-review.json`
- `explain-code.json`

**Important:** The file name should match the `name` field in the JSON.

## Quality Guidelines

Before submitting, ensure your command:

- [ ] Has a clear, descriptive name
- [ ] Uses the correct JSON format
- [ ] Contains actionable prompt content
- [ ] Doesn't duplicate existing commands
- [ ] Is tested by importing into SuperClawd
- [ ] Is added to `commands/README.md` catalog
- [ ] Has a name and file name in kebab-case

## Testing Your Command

1. Go to your SuperClawd workspace
2. Navigate to Commands
3. Click "Import" and upload your JSON file
4. Verify the command appears and works correctly
5. Test with and without arguments (if applicable)

---

# Contributing Workflows

This section explains how to submit workflows for others to use.

## How to Contribute Workflows

### 1. Fork this repository

Click the "Fork" button at the top right of this page.

### 2. Create your workflow file

Add your workflow JSON file to `workflows/examples/`:

```
workflows/
└── examples/
    └── your-workflow.json
```

### 3. Add to the catalog

Update `workflows/README.md` to include your workflow in the **Available Workflows** table.

### 4. Submit a Pull Request

Push your changes and open a PR.

## Workflow JSON Format

```json
{
  "name": "Bug Fix",
  "description": "Simple workflow for fixing a bug",
  "nodes": [
    {
      "type": "start",
      "title": "Bug Reported",
      "description": "A bug has been identified",
      "positionX": 250,
      "positionY": 50
    },
    {
      "type": "action",
      "title": "Fix",
      "description": "Implement the fix",
      "positionX": 250,
      "positionY": 150
    },
    {
      "type": "end",
      "title": "Done",
      "description": "Bug resolved",
      "positionX": 250,
      "positionY": 250
    }
  ],
  "edges": [
    { "sourceNodeIndex": 0, "targetNodeIndex": 1 },
    { "sourceNodeIndex": 1, "targetNodeIndex": 2 }
  ]
}
```

### Node Types

| Type | Description |
|------|-------------|
| `start` | Entry point of the workflow |
| `end` | Exit point of the workflow |
| `action` | A step or task to perform |
| `conditional` | A decision point with multiple paths |

### Edge Labels

For conditional nodes, use labels to indicate the path:

```json
{ "sourceNodeIndex": 0, "targetNodeIndex": 1, "label": "Yes" }
{ "sourceNodeIndex": 0, "targetNodeIndex": 2, "label": "No" }
```

## File Naming

Use kebab-case: `bug-fix.json`, `code-review.json`

## Testing Your Workflow

1. Go to your SuperClawd workspace
2. Navigate to Workflows
3. Click "Import" and upload your JSON file
4. Verify all nodes and edges imported correctly
