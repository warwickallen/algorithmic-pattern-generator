(function () {
  if (typeof window === "undefined") return;
  if (typeof window.registerSimulation !== "function") return;

  const plugin = {
    id: "reaction",
    apiVersion: "1.0.0",
    displayNameKey: "simulation.reaction",
    ui: { learnModalKey: "learn.reaction" },
    defaults: { speed: 30, cellSize: 6 },
    capabilities: { gridBased: true },
    create(canvas, ctx) {
      if (typeof ReactionDiffusion === "undefined") {
        throw new Error("ReactionDiffusion is not available");
      }
      return new ReactionDiffusion(canvas, ctx);
    },
  };

  window.registerSimulation(plugin);
})();
