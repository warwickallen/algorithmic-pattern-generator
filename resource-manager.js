// Centralised ResourceManager for automatic cleanup of listeners, timers, and RAF
(function (factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof window !== "undefined") {
    window.ResourceManager = factory();
  }
})(function () {
  class ResourceManager {
    constructor() {
      this.listeners = [];
      this.timeouts = new Set();
      this.intervals = new Set();
      this.rafIds = new Set();
      this.disposables = new Set();
    }

    on(target, event, handler, options) {
      if (!target || !target.addEventListener) return () => {};
      target.addEventListener(event, handler, options);
      const record = { target, event, handler, options };
      this.listeners.push(record);
      return () => this.off(record);
    }

    off(record) {
      const idx = this.listeners.indexOf(record);
      if (idx >= 0) this.listeners.splice(idx, 1);
      try {
        record.target.removeEventListener(record.event, record.handler, record.options);
      } catch (_) {}
    }

    setTimeout(fn, ms) {
      const id = setTimeout(() => {
        this.timeouts.delete(id);
        fn();
      }, ms);
      this.timeouts.add(id);
      return id;
    }

    clearTimeout(id) {
      if (this.timeouts.has(id)) {
        clearTimeout(id);
        this.timeouts.delete(id);
      }
    }

    setInterval(fn, ms) {
      const id = setInterval(fn, ms);
      this.intervals.add(id);
      return id;
    }

    clearInterval(id) {
      if (this.intervals.has(id)) {
        clearInterval(id);
        this.intervals.delete(id);
      }
    }

    requestAnimationFrame(cb) {
      const id = requestAnimationFrame((t) => {
        this.rafIds.delete(id);
        cb(t);
      });
      this.rafIds.add(id);
      return id;
    }

    cancelAnimationFrame(id) {
      if (this.rafIds.has(id)) {
        cancelAnimationFrame(id);
        this.rafIds.delete(id);
      }
    }

    addDisposable(disposable) {
      if (!disposable) return () => {};
      this.disposables.add(disposable);
      return () => this.disposables.delete(disposable);
    }

    cleanup() {
      // Listeners
      for (const rec of this.listeners) {
        try {
          rec.target.removeEventListener(rec.event, rec.handler, rec.options);
        } catch (_) {}
      }
      this.listeners = [];

      // Timers
      for (const id of this.timeouts) clearTimeout(id);
      for (const id of this.intervals) clearInterval(id);
      this.timeouts.clear();
      this.intervals.clear();

      // RAFs
      for (const id of this.rafIds) cancelAnimationFrame(id);
      this.rafIds.clear();

      // Disposables
      for (const d of this.disposables) {
        try {
          if (typeof d === "function") d();
          else if (d && typeof d.dispose === "function") d.dispose();
          else if (d && typeof d.cleanup === "function") d.cleanup();
        } catch (_) {}
      }
      this.disposables.clear();
    }
  }

  return ResourceManager;
});


