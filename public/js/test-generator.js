// Test Generator JavaScript - Additional utilities
window.testGenerator = {
  // Utility functions for test generation
  formatTestPattern(pattern) {
    return pattern.trim();
  },

  validateTestContent(content) {
    return content && content.trim().length > 100;
  },

  generateTestId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
};
