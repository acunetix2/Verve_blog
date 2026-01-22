import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * ENTERPRISE-GRADE HA (High Availability) Configuration
 * Includes:
 * - Circuit Breaker pattern
 * - Automatic retry with exponential backoff
 * - Request queuing during downtime
 * - 401 token expiration handling
 * - Comprehensive error tracking
 */

// ============================================================
// CIRCUIT BREAKER PATTERN
// ============================================================
class CircuitBreaker {
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  private failureThreshold = 5;
  private successThreshold = 3;
  private timeout = 30000; // 30 seconds before attempting recovery

  isOpen(): boolean {
    if (this.state === 'OPEN') {
      const timeSinceFailure = Date.now() - (this.lastFailureTime || 0);
      // Try to recover after timeout
      if (timeSinceFailure > this.timeout) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
      }
    }
  }

  recordFailure(): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }
}

// ============================================================
// REQUEST QUEUE FOR OFFLINE/RECOVERY MODE
// ============================================================
interface QueuedRequest {
  config: InternalAxiosRequestConfig;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  retryCount: number;
}

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private isProcessing = false;

  enqueue(config: InternalAxiosRequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        config,
        resolve,
        reject,
        retryCount: 0,
      });
    });
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (!request) break;

      try {
        const response = await axios.request(request.config);
        request.resolve(response);
      } catch (error) {
        request.reject(error);
      }
    }

    this.isProcessing = false;
  }

  getSize(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

// ============================================================
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ============================================================
function getRetryDelay(retryCount: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s
  return Math.min(1000 * Math.pow(2, retryCount), 30000) + Math.random() * 1000;
}

function isRetryableError(error: AxiosError): boolean {
  if (!error.response) return true; // Network error - retry
  const status = error.response.status;
  // Retry on: network errors, 408 (timeout), 429 (rate limit), 5xx (server errors)
  return status === 408 || status === 429 || (status >= 500 && status < 600);
}

// ============================================================
// GLOBAL INSTANCES
// ============================================================
const circuitBreaker = new CircuitBreaker();
const requestQueue = new RequestQueue();

// ============================================================
// AXIOS CONFIGURATION
// ============================================================
axios.defaults.timeout = 15000;

// Request interceptor - check circuit breaker
axios.interceptors.request.use(
  (config) => {
    // If circuit breaker is open, queue the request
    if (circuitBreaker.isOpen()) {
      throw new Error('SERVICE_DOWN_QUEUED');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors, retry, circuit breaker
axios.interceptors.response.use(
  (response) => {
    circuitBreaker.recordSuccess();
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { retryCount?: number };

    // ====== Handle Token Expiration (401) ======
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // ====== Handle Circuit Breaker / Service Down ======
    if (error.message === 'SERVICE_DOWN_QUEUED' || error.response?.status === 503) {
      circuitBreaker.recordFailure();
      return requestQueue.enqueue(config);
    }

    // ====== Handle Retryable Errors ======
    if (isRetryableError(error)) {
      config.retryCount = (config.retryCount || 0) + 1;
      const maxRetries = 3;

      if (config.retryCount <= maxRetries) {
        const delayMs = getRetryDelay(config.retryCount);

        return new Promise((resolve) => {
          setTimeout(() => {
            axios.request(config).then(resolve).catch((err) => {
              // Recursive: retry interceptor will be called again
              throw err;
            });
          }, delayMs);
        });
      } else {
        circuitBreaker.recordFailure();
      }
    } else {
      circuitBreaker.recordSuccess();
    }

    return Promise.reject(error);
  }
);

// ============================================================
// PERIODIC HEALTH CHECK & QUEUE PROCESSING
// ============================================================
setInterval(async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/health`, { timeout: 5000 });
    if (response.status === 200) {
      circuitBreaker.recordSuccess();
      // Try to process queued requests
      await requestQueue.processQueue();
    }
  } catch (error) {
    circuitBreaker.recordFailure();
  }
}, 10000); // Check every 10 seconds

// ============================================================
// EXPORTS FOR MONITORING
// ============================================================
export { circuitBreaker, requestQueue };
export default axios;
