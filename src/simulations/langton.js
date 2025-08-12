(function () {
  if (typeof window === "undefined") return;
  if (typeof window.registerSimulation !== "function") return;

  const plugin = {
    id: "langton",
    apiVersion: "1.0.0",
    displayNameKey: "simulation.langton",
    ui: { learnModalKey: "learn.langton" },
    defaults: { speed: 30, cellSize: 10 },
    capabilities: { actorBased: true, gridBased: true },
    create(canvas, ctx) {
      if (typeof LangtonsAnt === "undefined") {
        throw new Error("LangtonsAnt is not available");
      }
      return new LangtonsAnt(canvas, ctx);
    },
  };

  window.registerSimulation(plugin);
})();
