const { execSync } = require('child_process');
const { startSpinner, stopSpinner } = require('../ui');
const { createClient } = require('../api');

async function reviewBranch(args) {
  const bIndex = args.indexOf('-b');
  const branch = args[bIndex + 1];

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

    const spinner = startSpinner(`Analyzing code changes in branch "${branch}"...`);
    const client = createClient();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are a senior code reviewer. Review the following git diff and provide actionable feedback to make the code cleaner, more maintainable, and follow best practices.

For each issue found:
- Specify the file and line
- Explain the problem
- Suggest the improved code

Focus on: code quality, best practices, potential bugs, performance, readability, and security.

Git diff:
\`\`\`
${diff}
\`\`\``
        }
      ]
    });

    stopSpinner(spinner);

    console.log(`\n📝 Code Review for branch "${branch}"\n`);
    console.log('─'.repeat(50));
    console.log();
    console.log(message.content[0].text);
    console.log();
    console.log('─'.repeat(50));
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  }
}

module.exports = reviewBranch;
