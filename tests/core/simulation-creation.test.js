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

      const simulation = SimulationFactory.createSimulation(
        "conway",
        canvas,
        ctx
      );
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

      const simulation = SimulationFactory.createSimulation(
        "termite",
        canvas,
        ctx
      );
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

      const simulation = SimulationFactory.createSimulation(
        "langton",
        canvas,
        ctx
      );
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
