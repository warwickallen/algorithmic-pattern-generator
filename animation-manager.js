// AnimationManager centralises RAF with target FPS control
(function (factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof window !== "undefined") {
    window.AnimationManager = factory();
  }
})(function () {
  class AnimationManager {
    constructor({ fps = 60 } = {}) {
      this.fps = Math.max(1, Math.min(240, fps));
      this.frameInterval = 1000 / this.fps;
      this.lastTime = 0;
      this.rafId = null;
      this.isRunning = false;
      this.tick = null;
    }

    setFps(fps) {
      this.fps = Math.max(1, Math.min(240, fps));
      this.frameInterval = 1000 / this.fps;
    }

    start(tick) {
      if (this.isRunning) return;
      this.isRunning = true;
      this.tick = typeof tick === "function" ? tick : null;
      this.lastTime = 0;
      const loop = (time) => {
        if (!this.isRunning) return;
        if (!this.lastTime) this.lastTime = time;
        const delta = time - this.lastTime;
        if (delta >= this.frameInterval) {
          this.lastTime = time;
          try {
            this.tick && this.tick(time);
          } catch (_) {}
        }
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }

    stop() {
      this.isRunning = false;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  return AnimationManager;
});
