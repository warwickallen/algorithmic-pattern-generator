// KeyboardShortcutManager with declarative mapping
(function (factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof window !== "undefined") {
    window.KeyboardShortcutManager = factory();
  }
})(function () {
  class KeyboardShortcutManager {
    constructor(target = document) {
      this.target = target;
      this.map = new Map(); // key -> handler(e)
      this.enabled = true;
      this.bound = (e) => this.handle(e);
      if (this.target && this.target.addEventListener) {
        this.target.addEventListener("keydown", this.bound);
      }
    }

    register(key, handler) {
      if (!key || typeof handler !== "function") return;
      this.map.set(key, handler);
    }

    unregister(key) {
      this.map.delete(key);
    }

    setEnabled(v) {
      this.enabled = !!v;
    }

    handle(e) {
      if (!this.enabled) return;
      const handler = this.map.get(e.key);
      if (handler) {
        e.preventDefault();
        try {
          handler(e);
        } catch (_) {}
      }
    }

    cleanup() {
      if (this.target && this.bound && this.target.removeEventListener) {
        this.target.removeEventListener("keydown", this.bound);
      }
      this.map.clear();
    }
  }

  return KeyboardShortcutManager;
});
