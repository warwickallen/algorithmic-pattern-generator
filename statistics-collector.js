// StatisticsCollector with pluggable metrics
(function (factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof window !== "undefined") {
    window.StatisticsCollector = factory();
  }
})(function () {
  class StatisticsCollector {
    constructor() {
      this.metrics = new Map(); // key -> { samples: [], maxSamples }
      this.customComputations = new Map(); // key -> fn(samples) => any
    }

    defineMetric(key, { maxSamples = 200 } = {}) {
      if (!key) return;
      this.metrics.set(key, { samples: [], maxSamples });
    }

    setComputation(key, computeFn) {
      if (!key || typeof computeFn !== "function") return;
      this.customComputations.set(key, computeFn);
    }

    addSample(key, value) {
      const entry = this.metrics.get(key);
      if (!entry) return;
      entry.samples.push({ value, t: Date.now() });
      if (entry.samples.length > entry.maxSamples) entry.samples.shift();
    }

    getAverage(key) {
      const entry = this.metrics.get(key);
      if (!entry || entry.samples.length === 0) return 0;
      const sum = entry.samples.reduce((acc, s) => acc + (s.value || 0), 0);
      return sum / entry.samples.length;
    }

    getLatest(key) {
      const entry = this.metrics.get(key);
      if (!entry || entry.samples.length === 0) return null;
      return entry.samples[entry.samples.length - 1].value;
    }

    getComputed(key) {
      const compute = this.customComputations.get(key);
      const entry = this.metrics.get(key);
      if (!compute || !entry) return null;
      return compute(entry.samples.slice());
    }

    export() {
      const out = {};
      for (const [k, v] of this.metrics.entries()) out[k] = v.samples.slice();
      return out;
    }
  }

  return StatisticsCollector;
});


