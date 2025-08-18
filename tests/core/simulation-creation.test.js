(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Conway Game of Life Creation",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      const simulation = SimulationRegistry.create("conway", canvas, ctx);
      return {
        passed: simulation instanceof ConwayGameOfLife,
        details: `Created ${
          simulation && simulation.constructor && simulation.constructor.name
        }`,
      };
    },
    "core"
  );

  runner.addTest(
    "Termite Algorithm Creation",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      const simulation = SimulationRegistry.create("termite", canvas, ctx);
      return {
        passed: simulation instanceof TermiteAlgorithm,
        details: `Created ${
          simulation && simulation.constructor && simulation.constructor.name
        }`,
      };
    },
    "core"
  );

  runner.addTest(
    "Langton's Ant Creation",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      const simulation = SimulationRegistry.create("langton", canvas, ctx);
      return {
        passed: simulation instanceof LangtonsAnt,
        details: `Created ${
          simulation && simulation.constructor && simulation.constructor.name
        }`,
      };
    },
    "core"
  );
})();
