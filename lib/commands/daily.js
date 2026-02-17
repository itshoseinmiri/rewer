const { execSync } = require('child_process');
const { colors, startSpinner, stopSpinner } = require('../ui');
const { createClient } = require('../api');

async function dailyReport() {
  const c = colors;

  try {
    // Get all local branches
    const allBranches = execSync('git for-each-ref --format="%(refname:short)" refs/heads/', { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(Boolean);

    // Detect default branch
    let defaultBranch = 'main';
    if (!allBranches.includes('main') && allBranches.includes('master')) {
      defaultBranch = 'master';
    }

    // Find branches with commits from today (exclude default branch)
    const today = new Date().toISOString().split('T')[0];
    const todayBranches = [];

    for (const branch of allBranches) {
      if (branch === defaultBranch) continue;

      try {
        // Get commits on this branch (not on default) made today
        const log = execSync(
          `git log --since="midnight" --format="%H:%M" "${branch}" --not "${defaultBranch}" 2>/dev/null`,
          { encoding: 'utf-8' }
        ).trim();

        if (log) {
          todayBranches.push(branch);
        }
      } catch {
        // Branch might not have diverged from default, skip
      }
    }

    if (todayBranches.length === 0) {
      console.log(`\n${c.yellow}No branch activity found for today.${c.reset}`);
      console.log(`${c.gray}Tip: This checks for commits on non-${defaultBranch} branches made since midnight.${c.reset}\n`);
      process.exit(0);
    }

    // Default work period
    const startTime = '11:00';
    const endTime = '19:00';

    // Get today's date info
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

    // Send branch names to Claude for clean task titles
    const spinner = startSpinner('Generating daily report...');
    const client = createClient();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Convert these git branch names into clean, professional task titles.

Branch names:
${todayBranches.map(b => `- ${b}`).join('\n')}

Rules:
- Output ONLY the task titles, one per line, in the same order
- Make them concise and professional (e.g. "feature/swap-bridge-api" → "Swap & Bridge API Integration")
- Use Title Case
- No numbering, bullets, or extra text`
        }
      ]
    });

    stopSpinner(spinner);

    const taskTitles = message.content[0].text.trim().split('\n').filter(Boolean);

    // Build the report
    console.log();
    console.log(`${c.bold}📅 ${dateStr} – ${dayName} | ${startTime} – ${endTime}${c.reset}`);
    console.log();
    console.log(`${c.bold}🚀 Completed Today${c.reset}`);

    for (const title of taskTitles) {
      console.log(`${c.green}✅ ${title}${c.reset}`);
    }

    console.log();

    // Print copyable plain-text version
    console.log(`${c.gray}${'─'.repeat(52)}${c.reset}`);
    console.log(`${c.dim}📋 Copy-friendly version:${c.reset}\n`);
    console.log(`📅 ${dateStr} – ${dayName} | ${startTime} – ${endTime}`);
    console.log();
    console.log('🚀 Completed Today');
    for (const title of taskTitles) {
      console.log(`✅ ${title}`);
    }
    console.log();
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  }
}

module.exports = dailyReport;
