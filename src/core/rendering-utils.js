// Rendering Utilities Framework
class RenderingUtils {
  constructor() {
    this.renderCache = new Map();
    this.colorCache = new Map();
    this.maxCacheSize = 1000;
    this.performanceMetrics = {
      renderTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
    };
  }

  createColorManager() {
    return {
      hslToRgb(h, s, l) {
        if (typeof ColorUtils !== "undefined") {
          const { r, g, b } = ColorUtils.hslToRgb(h, s, l);
          return [r, g, b];
        }
        // Minimal inline fallback
        const convert = (hh, ss, ll) => {
          hh /= 360;
          ss /= 100;
          ll /= 100;
          const c = (1 - Math.abs(2 * ll - 1)) * ss;
          const x = c * (1 - Math.abs(((hh * 6) % 2) - 1));
          const m = ll - c / 2;
          let r, g, b;
          if (hh < 1 / 6) {
            r = c;
            g = x;
            b = 0;
          } else if (hh < 2 / 6) {
            r = x;
            g = c;
            b = 0;
          } else if (hh < 3 / 6) {
            r = 0;
            g = c;
            b = x;
          } else if (hh < 4 / 6) {
            r = 0;
            g = x;
            b = c;
          } else if (hh < 5 / 6) {
            r = x;
            g = 0;
            b = c;
          } else {
            r = c;
            g = 0;
            b = x;
          }
          return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255),
          ];
        };
        return convert(h, s, l);
      },

      applyBrightness(color, brightness) {
        const cacheKey = `${color}-${brightness}`;
        if (this.colorCache && this.colorCache.has(cacheKey)) {
          this.performanceMetrics.cacheHits++;
          return this.colorCache.get(cacheKey);
        }

        this.performanceMetrics.cacheMisses++;
        let rgb;
        if (color.startsWith("#")) {
          const hex = color.slice(1);
          rgb = [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
          ];
        } else if (color.startsWith("rgb")) {
          rgb = color.match(/\d+/g).map(Number);
        } else {
          return color;
        }

        const adjustedRgb = rgb.map((c) =>
          Math.min(255, Math.max(0, Math.round(c * brightness)))
        );
        const result = `rgb(${adjustedRgb[0]}, ${adjustedRgb[1]}, ${adjustedRgb[2]})`;

        if (this.colorCache && this.colorCache.size < this.maxCacheSize) {
          this.colorCache.set(cacheKey, result);
        }

        return result;
      },

      interpolateColor(color1, color2, factor) {
        const cacheKey = `${color1}-${color2}-${factor}`;
        if (this.colorCache && this.colorCache.has(cacheKey)) {
          this.performanceMetrics.cacheHits++;
          return this.colorCache.get(cacheKey);
        }
        this.performanceMetrics.cacheMisses++;

        let result;
        if (typeof ColorUtils !== "undefined") {
          result = ColorUtils.interpolateColor(color1, color2, factor);
        } else {
          const clamp = (v) => Math.max(0, Math.min(1, v));
          const f = clamp(factor);
          const parse = (c) =>
            c.startsWith("#")
              ? [
                  parseInt(c.slice(1, 3), 16),
                  parseInt(c.slice(3, 5), 16),
                  parseInt(c.slice(5, 7), 16),
                ]
              : (c.match(/\d+/g) || []).slice(0, 3).map(Number);
          const a = parse(color1);
          const b = parse(color2);
          if (!a || !b || a.length < 3 || b.length < 3) return color1;
          const out = a.map((c1, i) => Math.round(c1 + (b[i] - c1) * f));
          result = `rgb(${out[0]}, ${out[1]}, ${out[2]})`;
        }
        if (this.colorCache && this.colorCache.size < this.maxCacheSize) {
          this.colorCache.set(cacheKey, result);
        }
        return result;
      },

      parseColor(color) {
        if (typeof ColorUtils !== "undefined") {
          return ColorUtils.parseColor(color);
        }
        const matches = color && color.match && color.match(/\d+/g);
        return matches ? matches.slice(0, 3).map(Number) : null;
      },
    };
  }

  createPerformanceOptimizer() {
    return {
      debounceRender(func, delay = 16) {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func(...args), delay);
        };
      },
      throttleRender(func, limit = 16) {
        let inThrottle;
        return (...args) => {
          if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
          }
        };
      },
      measureRenderTime(func, ...args) {
        const startTime = performance.now();
        const result = func(...args);
        const endTime = performance.now();
        this.performanceMetrics.renderTime = endTime - startTime;
        return result;
      },
    };
  }

  createGridRenderer() {
    return {
      drawGrid(ctx, grid, cellSize, cellRenderer = null) {
        const startTime = performance.now();
        for (let row = 0; row < grid.length; row++) {
          for (let col = 0; col < grid[row].length; col++) {
            const x = col * cellSize;
            const y = row * cellSize;
            if (cellRenderer) {
              cellRenderer(ctx, x, y, cellSize, grid[row][col], row, col);
            } else {
              ctx.fillStyle = grid[row][col] ? "#ffffff" : "#000000";
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          }
        }
        this.performanceMetrics.renderTime = performance.now() - startTime;
      },
      drawCellWithGlow(ctx, x, y, size, color, glowIntensity = 0) {
        if (glowIntensity > 0) {
          ctx.shadowColor = color;
          ctx.shadowBlur = glowIntensity;
        }
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
        ctx.shadowBlur = 0;
      },
      drawActor(ctx, x, y, radius, color, direction = 0) {
        ctx.save();
        ctx.translate(x + radius, y + radius);
        ctx.rotate((direction * Math.PI) / 2);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius + 2);
        ctx.stroke();
        ctx.restore();
      },
    };
  }

  clearCaches() {
    this.renderCache.clear();
    this.colorCache.clear();
  }

  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  resetPerformanceMetrics() {
    this.performanceMetrics = { renderTime: 0, cacheHits: 0, cacheMisses: 0 };
  }
}

const renderingUtils = new RenderingUtils();
if (typeof window !== "undefined") {
  window.RenderingUtils = RenderingUtils;
  window.renderingUtils = renderingUtils;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { RenderingUtils, renderingUtils };
}
