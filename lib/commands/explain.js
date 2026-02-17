const fs = require('fs');
const path = require('path');
const { colors, startSpinner, stopSpinner, formatMarkdown } = require('../ui');
const { createClient } = require('../api');

async function explainFile(args) {
  const filePath = args[1];
  const resolved = path.resolve(filePath);

  if (!fs.existsSync(resolved)) {
    console.error(`Error: File not found: ${resolved}`);
    process.exit(1);
  }

  const c = colors;

  try {
    const content = fs.readFileSync(resolved, 'utf-8');
    const fileName = path.basename(resolved);

    const spinner = startSpinner(`Explaining "${fileName}"...`);
    const client = createClient();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are a senior software engineer. Explain the following file in a clear and structured way.

Cover:
- **Purpose**: What this file does and its role in the project
- **Key Components**: Important functions, classes, variables, and their responsibilities
- **Logic Flow**: How the code works step by step
- **Dependencies**: External modules or files it relies on

File: ${fileName}
\`\`\`
${content}
\`\`\``
        }
      ]
    });

    stopSpinner(spinner);

    console.log(`\n  ${c.bold}${c.cyan}📖 Explanation of "${fileName}"${c.reset}\n`);
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

module.exports = explainFile;
