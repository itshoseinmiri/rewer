# Rewer

AI-powered code review and developer tooling using Claude.

## Features

- **Branch Review** — Analyze git diffs with AI and get actionable code review feedback
- **Commit Message Generation** — Auto-generate Conventional Commits messages from your staged changes
- **File Explanation** — Get a clear breakdown of any file's purpose, logic, and components
- **Daily Report** — Generate a daily summary of completed work from today's branch activity
- **Security Scan** — Run a focused security audit on a branch or file with severity-ranked findings
- **VS Code Extension** — Run all commands directly from VS Code

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- An [Anthropic API key](https://console.anthropic.com/)

## Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/rewer.git
cd rewer

# Install dependencies
npm install

# Install the CLI globally
npm link
```

## Setup

Set your Anthropic API key as an environment variable:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

To make it permanent, add the line above to your `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`.

## CLI Commands

### `rewer -b <branch-name>`

Review branch changes. Compares the specified branch against `main` and sends the diff to Claude for a comprehensive code review covering code quality, best practices, potential bugs, performance, readability, and security.

```bash
rewer -b feature-login
```

---

### `rewer commit --msg`

Generate a commit message from staged changes. Analyzes `git diff --cached` and produces a message following the Conventional Commits specification. Falls back to unstaged changes if nothing is staged.

```bash
git add .
rewer commit --msg
```

Output format:

```
type(scope): short description

Body explaining what changed and why.
```

---

### `rewer explain <file>`

Explain a file's purpose, logic, and key components. Reads the file and sends it to Claude for a structured breakdown covering purpose, key components, logic flow, and dependencies.

```bash
rewer explain src/utils/auth.ts
```

---

### `rewer daily`

Generate a daily report from today's branch activity. Scans all local branches for commits made since midnight, converts branch names into clean task titles using Claude, and outputs a formatted summary.

```bash
rewer daily
```

Output format:

```
📅 2026-02-17 – Monday | 11:00 – 19:00

🚀 Completed Today
✅ User Authentication API Integration
✅ Profile Settings Page Implementation
```

A copy-friendly plain-text version is also printed below the styled output.

---

### `rewer security-scan`

Focused security audit of a branch or file. Scans for common vulnerabilities (injection, auth issues, data exposure, XSS, etc.) and reports findings ranked by severity from Critical to Low.

**Scan a branch:**

```bash
rewer security-scan -b feature-login
```

**Scan a file:**

```bash
rewer security-scan --file src/api/handler.ts
```

---

### Quick Reference

| Command | Description |
|---|---|
| `rewer -b <branch>` | Review branch changes |
| `rewer commit --msg` | Generate a commit message |
| `rewer explain <file>` | Explain a file |
| `rewer daily` | Daily work report |
| `rewer security-scan -b <branch>` | Security scan a branch |
| `rewer security-scan --file <file>` | Security scan a file |

> All commands require the `ANTHROPIC_API_KEY` environment variable to be set.

## VS Code Extension

To use as a VS Code extension during development:

1. Open this project in VS Code
2. Press `F5` to launch the Extension Development Host
3. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run:

| Command | Description |
|---|---|
| **Rewer: Show Changed Files** | Prompts for a branch name, then runs `rewer -b <branch>` |
| **Rewer: Generate Commit Message** | Runs `rewer commit --msg` |
| **Rewer: Explain File** | Explains the active file (or prompts for a path) |
| **Rewer: Daily Report** | Runs `rewer daily` |
| **Rewer: Security Scan** | Prompts to scan the active file or a branch |

## Uninstall

```bash
npm unlink -g rewer
```
