const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { colors, startSpinner, stopSpinner, formatMarkdown } = require('../ui');
const { createClient } = require('../api');

async function securityScan() {
  const c = colors;

  try {
    // Get changed files (staged + unstaged) compared to HEAD
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf-8' }).trim();
    const unstaged = execSync('git diff --name-only', { encoding: 'utf-8' }).trim();

    // Merge and deduplicate
    const allFiles = [...new Set(
      [staged, unstaged]
        .join('\n')
        .split('\n')
        .filter(Boolean)
    )];

    if (allFiles.length === 0) {
      console.log(`${c.yellow}No changed files found. Stage or modify files first.${c.reset}`);
      process.exit(0);
    }

    // Read contents of each changed file
    const fileContents = [];
    for (const file of allFiles) {
      const resolved = path.resolve(file);
      if (!fs.existsSync(resolved)) continue;

      const content = fs.readFileSync(resolved, 'utf-8');
      fileContents.push(`=== ${file} ===\n${content}`);
    }

    if (fileContents.length === 0) {
      console.log(`${c.yellow}Changed files could not be read (deleted?).${c.reset}`);
      process.exit(0);
    }

    const fileList = allFiles.join(', ');
    const spinner = startSpinner(`Scanning ${allFiles.length} changed file(s) for vulnerabilities...`);
    const client = createClient();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are a senior application security engineer performing a focused security audit on files that are about to be committed.

Analyze the following changed files and report any security vulnerabilities or risks.

For each finding, provide:
- **Severity**: Critical / High / Medium / Low / Info
- **Category**: (e.g. Injection, Auth, Data Exposure, XSS, CSRF, Insecure Config, etc.)
- **Location**: File name and line or code snippet where the issue occurs
- **Description**: What the vulnerability is and why it matters
- **Recommendation**: How to fix it, with a code example if applicable

Focus on OWASP Top 10 and common vulnerabilities:
- SQL/NoSQL/Command injection
- Cross-Site Scripting (XSS)
- Broken authentication & session management
- Sensitive data exposure (hardcoded secrets, API keys, tokens)
- Security misconfiguration
- Insecure deserialization
- Missing input validation
- Path traversal
- Insecure dependencies usage
- Improper error handling that leaks information

If no vulnerabilities are found, state that the code looks secure and suggest any hardening tips.

Order findings by severity (Critical first).

Changed files:
\`\`\`
${fileContents.join('\n\n')}
\`\`\``
        }
      ]
    });

    stopSpinner(spinner);

    console.log(`\n  ${c.bold}${c.cyan}🔒 Security Scan — ${allFiles.length} changed file(s)${c.reset}`);
    console.log(`  ${c.gray}Files: ${fileList}${c.reset}\n`);
    console.log(`${c.cyan}${'━'.repeat(52)}${c.reset}`);
    console.log();
    console.log(formatMarkdown(message.content[0].text));
    console.log();
    console.log(`${c.cyan}${'━'.repeat(52)}${c.reset}`);
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  }
}

module.exports = securityScan;
