// CanvasManager centralises canvas/context setup and resizing
(function (factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof window !== "undefined") {
    window.CanvasManager = factory();
  }
})(function () {
  class CanvasManager {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    }

    getCanvas() {
      return this.canvas;
    }
    getContext() {
      return this.ctx;
    }

    ensureAttachedSize() {
      if (!this.canvas) return { width: 0, height: 0 };
      let w = window.innerWidth;
      let h = window.innerHeight;
      if (!w || !h || w > 5000 || h > 5000) {
        const rect = this.canvas.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
      }
      if (!w || !h) {
        w = 800;
        h = 600;
      }
      this.canvas.width = w;
      this.canvas.height = h;
      return { width: w, height: h };
    }

    clear() {
      if (this.ctx && this.canvas)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  return CanvasManager;
});
