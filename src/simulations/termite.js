(function () {
  if (typeof window === "undefined") return;
  if (typeof window.registerSimulation !== "function") return;

  const plugin = {
    id: "termite",
    apiVersion: "1.0.0",
    displayNameKey: "simulation.termite",
    ui: { learnModalKey: "learn.termite" },
    defaults: { speed: 30, cellSize: 10 },
    capabilities: { actorBased: true, gridBased: true },
    create(canvas, ctx) {
      if (typeof TermiteAlgorithm === "undefined") {
        throw new Error("TermiteAlgorithm is not available");
      }
      return new TermiteAlgorithm(canvas, ctx);
    },
  };

  window.registerSimulation(plugin);
})();
