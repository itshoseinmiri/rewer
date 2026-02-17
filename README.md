# Rewer

AI-powered code review and commit message generator using Claude.

## Features

- **Branch Review** — Analyze git diffs with AI and get actionable code review feedback
- **Commit Message Generation** — Auto-generate Conventional Commits messages from your staged changes
- **VS Code Extension** — Run both commands directly from VS Code

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

## CLI Usage

### Review a branch

```bash
rewer -b <branch-name>
```

Compares the branch against `main` and provides AI-powered code review feedback.

### Generate a commit message

```bash
rewer commit --msg
```

Generates a commit message from your staged changes (falls back to unstaged if nothing is staged).

## VS Code Extension

To use as a VS Code extension during development:

1. Open this project in VS Code
2. Press `F5` to launch the Extension Development Host
3. Open the Command Palette (`Cmd+Shift+P`) and run:
   - **Rewer: Show Changed Files** — Review a branch
   - **Rewer: Generate Commit Message** — Generate a commit message

## Uninstall

```bash
npm unlink -g rewer
```
