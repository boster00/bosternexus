/**
 * Zoho Rate Limiter
 * 
 * Ensures all Zoho API requests respect the 1 request per second rate limit.
 * This class manages a queue of requests and processes them sequentially.
 */

export class ZohoRateLimiter {
  constructor() {
    this.lastRequestTime = 0;
    this.minInterval = 1000; // 1 second minimum between requests
    this.queue = [];
    this.processing = false;
  }

  async acquire() {
    return new Promise((resolve) => {
      this.queue.push(resolve);
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.minInterval) {
        const waitTime = this.minInterval - timeSinceLastRequest;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      this.lastRequestTime = Date.now();
      const resolve = this.queue.shift();
      resolve();
    }

    this.processing = false;
  }

  release() {
    // Rate limiter automatically releases after the interval
    // This method is kept for API compatibility
  }
}
