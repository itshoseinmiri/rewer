const { execSync } = require('child_process');
const { startSpinner, stopSpinner } = require('../ui');
const { createClient } = require('../api');

async function generateCommitMsg() {
  try {
    let diff = execSync('git diff --cached', { encoding: 'utf-8' }).trim();
    let source = 'staged';

    if (!diff) {
      diff = execSync('git diff', { encoding: 'utf-8' }).trim();
      source = 'unstaged';
    }

    if (!diff) {
      console.log('No changes found. Stage your changes with `git add` first.');
      process.exit(0);
    }

    const spinner = startSpinner(`Generating commit message from ${source} changes...`);
    const client = createClient();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an expert at writing concise, meaningful git commit messages following the Conventional Commits specification.

Analyze the following git diff and generate a commit message.

Rules:
- First line: type(scope): short description (max 72 chars)
  - Types: feat, fix, refactor, docs, style, test, chore, perf, ci, build
  - Scope is optional but recommended
- Leave a blank line after the first line
- Body: briefly explain WHAT changed and WHY (not HOW), wrap at 72 chars
- If there are multiple logical changes, mention each briefly in the body
- Do NOT include any markdown formatting, code fences, or extra commentary
- Output ONLY the commit message, nothing else

Git diff:
\`\`\`
${diff}
\`\`\``
        }
      ]
    });

    stopSpinner(spinner);

    const commitMsg = message.content[0].text.trim();

    console.log(`\n💬 Generated Commit Message (from ${source} changes)\n`);
    console.log('─'.repeat(50));
    console.log();
    console.log(commitMsg);
    console.log();
    console.log('─'.repeat(50));
    console.log('\nTo use this message:');
    console.log(`  git commit -m "${commitMsg.split('\n')[0]}"`);
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  }
}

module.exports = generateCommitMsg;
