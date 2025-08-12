(function () {
  if (typeof window === "undefined") return;
  if (typeof window.registerSimulation !== "function") return;

  const plugin = {
    id: "conway",
    apiVersion: "1.0.0",
    displayNameKey: "simulation.conway",
    ui: { learnModalKey: "learn.conway" },
    defaults: { speed: 30, cellSize: 10 },
    capabilities: { gridBased: true },
    create(canvas, ctx) {
      if (typeof ConwayGameOfLife === "undefined") {
        throw new Error("ConwayGameOfLife is not available");
      }
      return new ConwayGameOfLife(canvas, ctx);
    },
  };

  window.registerSimulation(plugin);
})();
