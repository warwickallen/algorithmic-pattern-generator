// Dynamic colour scheme implementation based on four-corner hue rotation
class DynamicColourScheme {
  constructor() {
    // Corner configurations from the YAML specification
    this.corners = {
      topLeft: { startHue: 45, period: 60000 }, // 60 seconds
      topRight: { startHue: 135, period: 75000 }, // 75 seconds
      bottomRight: { startHue: 225, period: 90000 }, // 90 seconds
      bottomLeft: { startHue: 315, period: 105000 }, // 105 seconds
    };
    this.startTime = Date.now();
    // Frame-based cache
    this._cache = {
      time: null,
      hues: {},
      vectors: {},
    };
  }

  // Get current hue for a specific corner (optionally using cache)
  getCornerHue(corner, currentTime = Date.now()) {
    const config = this.corners[corner];
    if (currentTime === 0) {
      return config.startHue;
    }
    const elapsed = currentTime - this.startTime;
    const hue = (config.startHue + (elapsed / config.period) * 360) % 360;
    return hue;
  }

  // Internal: update cache for a given currentTime
  _updateFrameCache(currentTime) {
    if (this._cache.time === currentTime) return;
    this._cache.time = currentTime;
    // Compute and cache hues
    this._cache.hues.topLeft = this.getCornerHue("topLeft", currentTime);
    this._cache.hues.topRight = this.getCornerHue("topRight", currentTime);
    this._cache.hues.bottomRight = this.getCornerHue(
      "bottomRight",
      currentTime
    );
    this._cache.hues.bottomLeft = this.getCornerHue("bottomLeft", currentTime);
    // Compute and cache vectors
    this._cache.vectors.topLeft = this.hueToVector(this._cache.hues.topLeft);
    this._cache.vectors.topRight = this.hueToVector(this._cache.hues.topRight);
    this._cache.vectors.bottomRight = this.hueToVector(
      this._cache.hues.bottomRight
    );
    this._cache.vectors.bottomLeft = this.hueToVector(
      this._cache.hues.bottomLeft
    );
  }

  // Get interpolated hue for any position on the canvas
  getHueAtPosition(x, y, canvasWidth, canvasHeight, currentTime = null) {
    // Clamp position to canvas bounds
    const clampedX = Math.max(0, Math.min(x, canvasWidth));
    const clampedY = Math.max(0, Math.min(y, canvasHeight));
    // Normalize position to 0-1 range
    const normX = clampedX / canvasWidth;
    const normY = clampedY / canvasHeight;
    if (currentTime === null) {
      // Static rendering: use starting hues
      return this.getBilinearHue(
        normX,
        normY,
        this.corners.topLeft.startHue,
        this.corners.topRight.startHue,
        this.corners.bottomRight.startHue,
        this.corners.bottomLeft.startHue
      );
    }
    // Dynamic rendering: use cached hues/vectors for this frame
    this._updateFrameCache(currentTime);
    return this.getBilinearHue(
      normX,
      normY,
      this._cache.hues.topLeft,
      this._cache.hues.topRight,
      this._cache.hues.bottomRight,
      this._cache.hues.bottomLeft,
      this._cache.vectors // pass cached vectors for optimisation
    );
  }

  // Get hue using proper bilinear interpolation with circular hue handling
  getBilinearHue(
    normX,
    normY,
    topLeftHue,
    topRightHue,
    bottomRightHue,
    bottomLeftHue,
    cachedVectors = null
  ) {
    // Use cached vectors if provided (from frame cache)
    const topLeftVector = cachedVectors
      ? cachedVectors.topLeft
      : this.hueToVector(topLeftHue);
    const topRightVector = cachedVectors
      ? cachedVectors.topRight
      : this.hueToVector(topRightHue);
    const bottomRightVector = cachedVectors
      ? cachedVectors.bottomRight
      : this.hueToVector(bottomRightHue);
    const bottomLeftVector = cachedVectors
      ? cachedVectors.bottomLeft
      : this.hueToVector(bottomLeftHue);
    // Interpolate vectors instead of angles
    const topVector = this.interpolateVector(
      topLeftVector,
      topRightVector,
      normX
    );
    const bottomVector = this.interpolateVector(
      bottomLeftVector,
      bottomRightVector,
      normX
    );
    const finalVector = this.interpolateVector(topVector, bottomVector, normY);
    // Convert back to hue
    return this.vectorToHue(finalVector);
  }

  // Convert hue to unit vector on the colour wheel
  hueToVector(hue) {
    const angle = (hue * Math.PI) / 180;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }

  // Convert unit vector back to hue
  vectorToHue(vector) {
    let angle = Math.atan2(vector.y, vector.x);
    if (angle < 0) angle += 2 * Math.PI;
    return (angle * 180) / Math.PI;
  }

  // Linear interpolation between two vectors
  interpolateVector(a, b, t) {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    };
  }

  // Convert HSL to RGB using shared utility or fallback
  hslToRgb(h, s, l) {
    if (typeof ColorUtils !== "undefined" && ColorUtils.hslToRgb) {
      return ColorUtils.hslToRgb(h, s, l);
    }
    // Fallback
    h /= 360;
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;
    let r, g, b;
    if (h < 1 / 6) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 2 / 6) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 3 / 6) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 4 / 6) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 5 / 6) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  // Get RGB colour for a position with specified saturation and lightness
  getColourAtPosition(
    x,
    y,
    canvasWidth,
    canvasHeight,
    saturation = 80,
    lightness = 50,
    currentTime = null
  ) {
    const hue = this.getHueAtPosition(
      x,
      y,
      canvasWidth,
      canvasHeight,
      currentTime
    );
    const rgb = this.hslToRgb(hue, saturation, lightness);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }
}

if (typeof window !== "undefined") {
  window.DynamicColourScheme = DynamicColourScheme;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DynamicColourScheme };
}
