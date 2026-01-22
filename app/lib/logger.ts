/**
 * Production-safe logging utility
 * Only logs in development mode, silently ignored in production
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log info messages (development only)
   */
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`ℹ️ [INFO] ${message}`, data || "");
    }
  },

  /**
   * Log error messages (development only)
   */
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`❌ [ERROR] ${message}`, error || "");
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`⚠️ [WARN] ${message}`, data || "");
    }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.debug(`🐛 [DEBUG] ${message}`, data || "");
    }
  },

  /**
   * Log success messages (development only)
   */
  success: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`✅ [SUCCESS] ${message}`, data || "");
    }
  },
};

export default logger;
