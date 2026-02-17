const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { colors, startSpinner, stopSpinner, formatMarkdown } = require('../ui');
const { createClient } = require('../api');

function showScanUsage() {
  console.log('Usage:');
  console.log('  rewer security-scan -b <branch>       Scan branch changes for vulnerabilities');
  console.log('  rewer security-scan --file <file>      Scan a single file for vulnerabilities');
  process.exit(1);
}

async function securityScan(args) {
  const c = colors;
  const hasBranch = args.includes('-b');
  const hasFile = args.includes('--file');

  if (!hasBranch && !hasFile) {
    showScanUsage();
  }

  let target;
  let code;
  let label;

  if (hasBranch) {
    const bIndex = args.indexOf('-b');
    const branch = args[bIndex + 1];
    if (!branch) showScanUsage();

    try {
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();

      let diff;
      if (currentBranch === branch) {
        diff = execSync('git diff main', { encoding: 'utf-8' }).trim();
      } else {
        diff = execSync(`git diff main...${branch}`, { encoding: 'utf-8' }).trim();
      }

      if (!diff) {
        console.log(`No changes found in branch "${branch}".`);
        process.exit(0);
      }

      target = `branch "${branch}"`;
      label = `branch diff`;
      code = diff;
    } catch (err) {
      console.error(`\nError: ${err.message}`);
      process.exit(1);
    }
  } else {
    const fIndex = args.indexOf('--file');
    const filePath = args[fIndex + 1];
    if (!filePath) showScanUsage();

    const resolved = path.resolve(filePath);
    if (!fs.existsSync(resolved)) {
      console.error(`Error: File not found: ${resolved}`);
      process.exit(1);
    }

    const fileName = path.basename(resolved);
    target = `"${fileName}"`;
    label = `file: ${fileName}`;
    code = fs.readFileSync(resolved, 'utf-8');
  }

  try {
    const spinner = startSpinner(`Scanning ${target} for security vulnerabilities...`);
    const client = createClient();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are a senior application security engineer performing a focused security audit.

Analyze the following ${label} and report any security vulnerabilities or risks.

For each finding, provide:
- **Severity**: Critical / High / Medium / Low / Info
- **Category**: (e.g. Injection, Auth, Data Exposure, XSS, CSRF, Insecure Config, etc.)
- **Location**: File and line or code snippet where the issue occurs
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

Code to scan:
\`\`\`
${code}
\`\`\``
        }
      ]
    });

    stopSpinner(spinner);

    console.log(`\n  ${c.bold}${c.cyan}🔒 Security Scan — ${target}${c.reset}\n`);
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
