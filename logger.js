// Simple centralised logger with levels
// Exposes global Logger (browser) and CommonJS export (tests)
(function(factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof window !== 'undefined') {
    window.Logger = factory();
  }
})(function() {
  const levels = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
  let currentLevel = levels.info;

  function logAt(levelName, method, args) {
    if (levels[levelName] <= currentLevel) {
      const c = (typeof console !== 'undefined' && console) || null;
      if (c && typeof c[method] === 'function') {
        try { c[method](...args); } catch (_) { /* ignore */ }
      }
    }
  }

  return {
    levels,
    setLevel(name) { if (name in levels) currentLevel = levels[name]; },
    getLevel() { return currentLevel; },
    error(...args) { logAt('error', 'error', args); },
    warn(...args) { logAt('warn', 'warn', args); },
    info(...args) { logAt('info', 'log', args); },
    debug(...args) { logAt('debug', 'debug', args); },
  };
});


