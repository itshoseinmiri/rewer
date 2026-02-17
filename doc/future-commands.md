# Future Commands

Ideas for new commands to build in Rewer. Each follows the same pattern: gather context from Git/filesystem, send it to the Anthropic API, and display the result.

---

### `rewer explain <file>`

**AI-powered explanation of what a file or function does.**

Reads the specified file and sends its content to Claude AI for a clear, concise explanation of its purpose, logic, and key components.

**Usage:**

```bash
rewer explain src/utils/auth.ts
```

---

### `rewer refactor <file>`

**Suggest refactoring improvements for a file.**

Analyzes the specified file and provides actionable refactoring suggestions to improve code quality, readability, and maintainability.

**Usage:**

```bash
rewer refactor src/handlers/login.ts
```

---

### `rewer changelog`

**Auto-generate a changelog from recent commits.**

Reads the Git commit history and generates a structured changelog grouped by type (features, fixes, etc.).

**Usage:**

```bash
rewer changelog
```

---

### `rewer pr-summary`

**Generate a pull request title and description from branch diff.**

Compares the current branch against `main` and produces a ready-to-use PR title and body summarizing the changes.

**Usage:**

```bash
rewer pr-summary
```

---

### `rewer test-suggest`

**Suggest unit tests for changed code.**

Analyzes staged or branch changes and generates unit test suggestions covering edge cases and expected behavior.

**Usage:**

```bash
rewer test-suggest
```

---

### `rewer security-scan`

**Focused security audit of a branch or file.**

Scans the specified target for common security vulnerabilities (injection, auth issues, data exposure, etc.) and reports findings with severity levels.

**Usage:**

```bash
rewer security-scan -b feature-login
rewer security-scan --file src/api/handler.ts
```

---

### `rewer doc <file>`

**Generate documentation for a file or module.**

Reads the specified file and produces documentation including function signatures, parameter descriptions, return values, and usage examples.

**Usage:**

```bash
rewer doc src/services/review.ts
```

---

### `rewer review-file <file>`

**Review a single file instead of a whole branch.**

Sends a single file to Claude AI for a focused code review, useful when you want feedback on a specific file without reviewing an entire branch diff.

**Usage:**

```bash
rewer review-file src/extension.ts
```
