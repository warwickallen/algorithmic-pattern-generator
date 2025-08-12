// Centralised Error Handling
class ErrorHandler {
  constructor() {
    this.strategies = new Map();
    this.defaultStrategy = {
      handle: ({ type, simulationId, scope, message, error }) => {
        const simPart = simulationId ? `[${simulationId}] ` : "";
        const scopePart = scope ? `${scope}: ` : "";
        console.error(
          `ErrorHandler ${simPart}${type} ${scopePart}${message}`,
          error
        );
      },
    };
    this.metrics = {
      total: 0,
      byType: new Map(),
      bySimulation: new Map(),
    };
  }

  setDefaultStrategy(strategy) {
    if (strategy && typeof strategy.handle === "function") {
      this.defaultStrategy = strategy;
    }
  }

  registerStrategy(simulationId, strategy) {
    if (!simulationId || !strategy || typeof strategy.handle !== "function")
      return;
    this.strategies.set(simulationId, strategy);
  }

  handle({
    type,
    simulationId = null,
    scope = null,
    message = "",
    error = null,
  }) {
    // Update metrics
    this.metrics.total++;
    this.metrics.byType.set(type, (this.metrics.byType.get(type) || 0) + 1);
    if (simulationId) {
      const simCounts = this.metrics.bySimulation.get(simulationId) || {};
      simCounts[type] = (simCounts[type] || 0) + 1;
      this.metrics.bySimulation.set(simulationId, simCounts);
    }

    // Route to strategy
    const strategy =
      (simulationId && this.strategies.get(simulationId)) ||
      this.defaultStrategy;
    try {
      strategy.handle({ type, simulationId, scope, message, error });
    } catch (strategyError) {
      // Fallback to console if strategy itself fails
      console.error("ErrorHandler strategy failure:", strategyError);
      console.error("Original error context:", {
        type,
        simulationId,
        scope,
        message,
      });
      if (error) console.error("Original error:", error);
    }
  }

  getMetrics() {
    // Return a shallow clone that is easy to inspect in tests/UIs
    const byType = {};
    for (const [k, v] of this.metrics.byType.entries()) byType[k] = v;
    const bySimulation = {};
    for (const [sim, counts] of this.metrics.bySimulation.entries()) {
      bySimulation[sim] = { ...counts };
    }
    return { total: this.metrics.total, byType, bySimulation };
  }
}

// Global instance and exposure
const errorHandler = new ErrorHandler();
if (typeof window !== "undefined") {
  window.ErrorHandler = ErrorHandler;
  window.errorHandler = errorHandler;
}

// CommonJS export for tests/node
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ErrorHandler, errorHandler };
}
