const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

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

function formatMarkdown(text) {
  const c = colors;
  const lines = text.split('\n');
  const formatted = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // Code block toggle
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) {
        const lang = line.trim().slice(3);
        formatted.push(`  ${c.gray}${'─'.repeat(44)} ${lang}${c.reset}`);
      } else {
        formatted.push(`  ${c.gray}${'─'.repeat(48)}${c.reset}`);
      }
      continue;
    }

    if (inCodeBlock) {
      formatted.push(`  ${c.gray}│${c.reset} ${c.green}${line}${c.reset}`);
      continue;
    }

    // ## Headers
    if (/^#{1,3}\s/.test(line)) {
      const content = line.replace(/^#+\s*/, '');
      formatted.push('');
      formatted.push(`  ${c.cyan}${c.bold}${content}${c.reset}`);
      formatted.push(`  ${c.cyan}${'─'.repeat(content.length + 2)}${c.reset}`);
      continue;
    }

    // **Bold section labels** (like "**Purpose**:")
    if (/^\s*[-*]\s+\*\*/.test(line)) {
      const styled = line
        .replace(/^(\s*)[-*]\s+/, `$1  ${c.yellow}▸${c.reset} `)
        .replace(/\*\*([^*]+)\*\*/g, `${c.yellow}${c.bold}$1${c.reset}`);
      formatted.push(styled);
      continue;
    }

    // Nested bullets (indented - or *)
    if (/^\s{2,}[-*]\s/.test(line)) {
      const styled = line
        .replace(/^(\s*)[-*]\s/, `$1    ${c.gray}◦${c.reset} `)
        .replace(/\*\*([^*]+)\*\*/g, `${c.bold}$1${c.reset}`)
        .replace(/`([^`]+)`/g, `${c.magenta}$1${c.reset}`);
      formatted.push(styled);
      continue;
    }

    // Top-level bullets
    if (/^[-*]\s/.test(line)) {
      const styled = line
        .replace(/^[-*]\s/, `  ${c.blue}●${c.reset} `)
        .replace(/\*\*([^*]+)\*\*/g, `${c.bold}$1${c.reset}`)
        .replace(/`([^`]+)`/g, `${c.magenta}$1${c.reset}`);
      formatted.push(styled);
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      const styled = line
        .replace(/^(\d+)\.\s/, `  ${c.blue}$1.${c.reset} `)
        .replace(/\*\*([^*]+)\*\*/g, `${c.bold}$1${c.reset}`)
        .replace(/`([^`]+)`/g, `${c.magenta}$1${c.reset}`);
      formatted.push(styled);
      continue;
    }

    // Regular text — apply inline formatting
    let styled = line
      .replace(/\*\*([^*]+)\*\*/g, `${c.bold}$1${c.reset}`)
      .replace(/`([^`]+)`/g, `${c.magenta}$1${c.reset}`);
    formatted.push(styled);
  }

  return formatted.join('\n');
}

module.exports = { colors, startSpinner, stopSpinner, formatMarkdown };
