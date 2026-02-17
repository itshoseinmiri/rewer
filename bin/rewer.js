#!/usr/bin/env node

const { execSync } = require('child_process');
const Anthropic = require('@anthropic-ai/sdk');

const args = process.argv.slice(2);
const command = args[0];

function showUsage() {
  console.log('Usage:');
  console.log('  rewer -b <branch-name>     Review branch changes');
  console.log('  rewer commit --msg         Generate a commit message from staged changes');
  process.exit(1);
}

function requireApiKey() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    console.error('Set it with: export ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(1);
  }
}

function startSpinner(text) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r${frames[i++ % frames.length]} ${text}`);
  }, 80);
}

function stopSpinner(spinner) {
  clearInterval(spinner);
  process.stdout.write('\r' + ' '.repeat(80) + '\r');
}

async function reviewBranch() {
  const bIndex = args.indexOf('-b');
  if (bIndex === -1 || !args[bIndex + 1]) {
    showUsage();
  }

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
    const client = new Anthropic();

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

async function generateCommitMsg() {
  try {
    // Get staged changes first, fall back to all uncommitted changes
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
    const client = new Anthropic();

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

// Route commands
if (command === 'commit' && args.includes('--msg')) {
  requireApiKey();
  generateCommitMsg();
} else if (args.includes('-b')) {
  requireApiKey();
  reviewBranch();
} else {
  showUsage();
}
