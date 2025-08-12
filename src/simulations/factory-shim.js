// Backwards-compatibility shim: route SimulationFactory to SimulationRegistry
(function () {
  if (typeof window === "undefined") return;
  function applyShim() {
    if (!window.SimulationRegistry) return;
    const registry = window.SimulationRegistry;
    const factory = (window.SimulationFactory = window.SimulationFactory || {});
    const original = factory.createSimulation;
    factory.createSimulation = function (type, canvas, ctx) {
      if (
        registry &&
        typeof registry.has === "function" &&
        registry.has(type)
      ) {
        return registry.create(type, canvas, ctx);
      }
      if (typeof original === "function") {
        return original.call(factory, type, canvas, ctx);
      }
      throw new Error(`Unknown simulation type: ${type}`);
    };
  }
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    applyShim();
  } else {
    window.addEventListener("DOMContentLoaded", applyShim);
  }
})();
