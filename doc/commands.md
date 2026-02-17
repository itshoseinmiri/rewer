# Rewer Commands

## CLI Commands

### `rewer -b <branch-name>`

**Review branch changes.**

Compares the specified branch against `main` and sends the diff to Claude AI for a comprehensive code review. The review covers code quality, best practices, potential bugs, performance, readability, and security.

**Usage:**

```bash
rewer -b feature-login
```

**Requires:** `ANTHROPIC_API_KEY` environment variable.

---

### `rewer commit --msg`

**Generate a commit message from file changes.**

Analyzes staged changes (`git diff --cached`) to generate a commit message following the Conventional Commits specification. If no staged changes exist, it falls back to unstaged changes.

**Usage:**

```bash
git add .
rewer commit --msg
```

**Output format:**

```
type(scope): short description

Body explaining what changed and why.
```

**Requires:** `ANTHROPIC_API_KEY` environment variable.

---

## VS Code Commands

These commands are available via the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).

### `Rewer: Show Changed Files`

Opens a terminal and runs `rewer -b <branch>` after prompting for a branch name.

### `Rewer: Generate Commit Message`

Opens a terminal and runs `rewer commit --msg` to generate a commit message from your current changes.
