const Anthropic = require('@anthropic-ai/sdk');

function requireApiKey() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    console.error('Set it with: export ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(1);
  }
}

function createClient() {
  return new Anthropic();
}

module.exports = { requireApiKey, createClient };
