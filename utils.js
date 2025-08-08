// Shared utility modules

// Colour utilities centralised for reuse across the app
// Provides consistent parsing, conversion, and interpolation helpers
const ColorUtils = {
  // Core HSL -> RGB conversion returning array [r, g, b]
  hslToRgbArray(h, s, l) {
    let hh = h / 360;
    let ss = s / 100;
    let ll = l / 100;

    const c = (1 - Math.abs(2 * ll - 1)) * ss;
    const x = c * (1 - Math.abs((hh * 6) % 2 - 1));
    const m = ll - c / 2;

    let r, g, b;
    if (hh < 1 / 6) {
      r = c; g = x; b = 0;
    } else if (hh < 2 / 6) {
      r = x; g = c; b = 0;
    } else if (hh < 3 / 6) {
      r = 0; g = c; b = x;
    } else if (hh < 4 / 6) {
      r = 0; g = x; b = c;
    } else if (hh < 5 / 6) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  },

  // Convenience wrapper returning object { r, g, b }
  hslToRgb(h, s, l) {
    const [r, g, b] = this.hslToRgbArray(h, s, l);
    return { r, g, b };
  },

  // Parse hex or rgb(a) colour string into [r, g, b] array
  parseColor(color) {
    if (typeof color !== 'string') return null;
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16)
        ];
      }
      if (hex.length === 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16)
        ];
      }
      return null;
    }
    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      if (!matches) return null;
      return matches.slice(0, 3).map(Number);
    }
    return null;
  },

  // Interpolate two colours (hex or rgb/rgba) and return an 'rgb(r, g, b)' string
  interpolateColor(color1, color2, factor) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    if (!rgb1 || !rgb2) return color1;
    const clamped = Math.max(0, Math.min(1, factor));
    const interpolated = rgb1.map((c1, i) => Math.round(c1 + (rgb2[i] - c1) * clamped));
    return `rgb(${interpolated[0]}, ${interpolated[1]}, ${interpolated[2]})`;
  }
};

// Expose globally for browser
if (typeof window !== 'undefined') {
  window.ColorUtils = ColorUtils;
}

// Export for CommonJS environments (tests/node)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ColorUtils };
}


