/**
 * Log Viewer Script
 * 
 * Displays recent log entries from log files.
 * 
 * Usage:
 *   node scripts/check-logs.js [level] [lines]
 * 
 * Examples:
 *   node scripts/check-logs.js error 20    # Last 20 error logs
 *   node scripts/check-logs.js info 50     # Last 50 info logs
 *   node scripts/check-logs.js combined 100 # Last 100 logs from all levels
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOG_DIR = path.join(PROJECT_ROOT, 'logs');

/**
 * Get recent log entries from a log file
 * @param {string} level - Log level (error, warn, info, debug, combined)
 * @param {number} lines - Number of lines to retrieve
 * @returns {string} Formatted log output
 */
function getRecentLogs(level = 'error', lines = 50) {
  const logFile = path.join(LOG_DIR, `${level}.log`);
  
  if (!fs.existsSync(logFile)) {
    return `No ${level}.log file found.`;
  }

  try {
    const content = fs.readFileSync(logFile, 'utf-8');
    const logLines = content.trim().split('\n').filter(Boolean);
    
    if (logLines.length === 0) {
      return `No logs found in ${level}.log`;
    }

    const recentLines = logLines.slice(-lines);
    
    // Parse and format JSON log entries
    const formattedLogs = recentLines.map((line, index) => {
      try {
        const entry = JSON.parse(line);
        const timestamp = new Date(entry.timestamp).toLocaleString();
        return `[${timestamp}] [${entry.level?.toUpperCase() || 'LOG'}] ${entry.message}${entry.error ? ` - Error: ${entry.error}` : ''}${Object.keys(entry).filter(k => !['timestamp', 'level', 'message', 'error'].includes(k)).length > 0 ? `\n  Data: ${JSON.stringify(Object.fromEntries(Object.entries(entry).filter(([k]) => !['timestamp', 'level', 'message', 'error'].includes(k))), null, 2)}` : ''}`;
      } catch (parseError) {
        // If line is not JSON, return as-is
        return line;
      }
    });

    return formattedLogs.join('\n\n');
  } catch (error) {
    return `Error reading log file: ${error.message}`;
  }
}

/**
 * Get log file statistics
 * @returns {object} Statistics about log files
 */
function getLogStats() {
  const stats = {
    error: 0,
    warn: 0,
    info: 0,
    debug: 0,
    combined: 0,
  };

  Object.keys(stats).forEach(level => {
    const logFile = path.join(LOG_DIR, `${level}.log`);
    if (fs.existsSync(logFile)) {
      try {
        const content = fs.readFileSync(logFile, 'utf-8');
        const lines = content.trim().split('\n').filter(Boolean);
        stats[level] = lines.length;
      } catch (error) {
        // Ignore read errors
      }
    }
  });

  return stats;
}

// Main execution
const level = process.argv[2] || 'error';
const lines = parseInt(process.argv[3] || '50', 10);

// Validate level
const validLevels = ['error', 'warn', 'info', 'debug', 'combined'];
if (!validLevels.includes(level)) {
  console.error(`Invalid log level: ${level}`);
  console.error(`Valid levels: ${validLevels.join(', ')}`);
  process.exit(1);
}

// Display statistics
const stats = getLogStats();
console.log('=== Log Statistics ===');
Object.entries(stats).forEach(([lvl, count]) => {
  if (count > 0 || lvl === level) {
    console.log(`${lvl.padEnd(10)}: ${count} entries`);
  }
});
console.log('');

// Display recent logs
console.log(`=== Recent ${level.toUpperCase()} Logs (last ${lines} entries) ===`);
const logs = getRecentLogs(level, lines);
console.log(logs);
