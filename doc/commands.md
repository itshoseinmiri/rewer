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

### `rewer explain <file>`

**Explain a file's purpose, logic, and key components.**

Reads the specified file and sends its contents to Claude AI for a clear, structured explanation covering the file's purpose, key components, logic flow, and dependencies.

**Usage:**

```bash
rewer explain src/index.ts
```

**Requires:** `ANTHROPIC_API_KEY` environment variable.

---

### `rewer daily`

**Generate a daily report from today's branch activity.**

Scans all local branches for commits made since midnight (excluding the default branch), sends the branch names to Claude AI to generate clean task titles, and outputs a formatted daily summary with the date, working hours, and completed tasks.

**Usage:**

```bash
rewer daily
```

**Output format:**

```
📅 2026-02-17 – Monday | 09:30 – 18:45

🚀 Completed Today
✅ User Authentication API Integration
✅ Profile Settings Page Implementation
```

A copy-friendly plain-text version is also printed below the styled output.

**Requires:** `ANTHROPIC_API_KEY` environment variable.

---

## VS Code Commands

These commands are available via the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).

### `Rewer: Show Changed Files`

Opens a terminal and runs `rewer -b <branch>` after prompting for a branch name.

### `Rewer: Generate Commit Message`

Opens a terminal and runs `rewer commit --msg` to generate a commit message from your current changes.

### `Rewer: Explain File`

Explains the currently open file (or prompts for a file path) by running `rewer explain <file>` in a terminal.

### `Rewer: Daily Report`

Opens a terminal and runs `rewer daily` to generate a daily summary of completed branch work.
