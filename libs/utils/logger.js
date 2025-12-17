/**
 * Logger Utility
 * 
 * Structured file logging for Boster Nexus.
 * Writes logs to files in the logs/ directory, organized by log level.
 * 
 * Usage:
 *   import { Logger } from '@/libs/utils/logger';
 *   Logger.error('Operation failed', error);
 *   Logger.info('Items synced', { count: 5 });
 *   Logger.warn('Rate limit approaching', { remaining: 10 });
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log directory relative to project root
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const LOG_DIR = path.join(PROJECT_ROOT, 'logs');

export class Logger {
  /**
   * Ensure log directory exists
   */
  static ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  }

  /**
   * Write log entry to file
   * @param {string} level - Log level (error, warn, info, debug)
   * @param {string} message - Log message
   * @param {object} data - Additional data to include in log
   */
  static write(level, message, data = {}) {
    try {
      this.ensureLogDir();
      
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        message,
        ...data,
      };

      // Write to level-specific log file
      const logFile = path.join(LOG_DIR, `${level}.log`);
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n', 'utf8');

      // Also write to combined log file
      const combinedLogFile = path.join(LOG_DIR, 'combined.log');
      fs.appendFileSync(combinedLogFile, JSON.stringify(logEntry) + '\n', 'utf8');

      // Output to console in development
      if (process.env.NODE_ENV !== 'production') {
        const consoleMethod = level === 'error' ? console.error : 
                             level === 'warn' ? console.warn : 
                             console.log;
        consoleMethod(`[${level.toUpperCase()}] ${message}`, data);
      }
    } catch (error) {
      // Fallback to console if file writing fails
      console.error('Logger error:', error);
      console.error(`[${level.toUpperCase()}] ${message}`, data);
    }
  }

  /**
   * Log error
   * @param {string} message - Error message
   * @param {Error|object} error - Error object or error data
   * @param {object} context - Additional context data
   */
  static error(message, error = null, context = {}) {
    const errorData = {
      ...context,
    };

    if (error) {
      if (error instanceof Error) {
        errorData.error = error.message;
        errorData.stack = error.stack;
        errorData.name = error.name;
      } else if (typeof error === 'object') {
        Object.assign(errorData, error);
      } else {
        errorData.error = String(error);
      }
    }

    this.write('error', message, errorData);
  }

  /**
   * Log warning
   * @param {string} message - Warning message
   * @param {object} data - Additional data
   */
  static warn(message, data = {}) {
    this.write('warn', message, data);
  }

  /**
   * Log info
   * @param {string} message - Info message
   * @param {object} data - Additional data
   */
  static info(message, data = {}) {
    this.write('info', message, data);
  }

  /**
   * Log debug (only in development)
   * @param {string} message - Debug message
   * @param {object} data - Additional data
   */
  static debug(message, data = {}) {
    if (process.env.NODE_ENV !== 'production') {
      this.write('debug', message, data);
    }
  }

  /**
   * Get log directory path
   * @returns {string} Path to logs directory
   */
  static getLogDir() {
    return LOG_DIR;
  }
}
