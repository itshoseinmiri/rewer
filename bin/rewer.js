#!/usr/bin/env node

const { requireApiKey } = require('../lib/api');
const reviewBranch = require('../lib/commands/review');
const generateCommitMsg = require('../lib/commands/commit');
const explainFile = require('../lib/commands/explain');
const dailyReport = require('../lib/commands/daily');
const securityScan = require('../lib/commands/security-scan');

const args = process.argv.slice(2);
const command = args[0];

function showUsage() {
  console.log('Usage:');
  console.log('  rewer -b <branch-name>     Review branch changes');
  console.log('  rewer commit --msg         Generate a commit message from staged changes');
  console.log('  rewer explain <file>       Explain a file\'s purpose, logic, and key components');
  console.log('  rewer daily                Generate a daily report from today\'s branch activity');
  console.log('  rewer security-scan        Scan changed files for security vulnerabilities');
  process.exit(1);
}

// Route commands
if (command === 'commit' && args.includes('--msg')) {
  requireApiKey();
  generateCommitMsg();
} else if (command === 'explain' && args[1]) {
  requireApiKey();
  explainFile(args);
} else if (command === 'daily') {
  requireApiKey();
  dailyReport();
} else if (command === 'security-scan') {
  requireApiKey();
  securityScan();
} else if (args.includes('-b')) {
  requireApiKey();
  reviewBranch(args);
} else {
  showUsage();
}
