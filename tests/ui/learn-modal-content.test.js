(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Learn Modal Shows Correct Content for Current Simulation",
    async () => {
      if (typeof AlgorithmicPatternGenerator === "undefined") {
        return { skip: true, details: "Skipped: app not available" };
      }
      const app = new AlgorithmicPatternGenerator();
      app.init();

      app.switchSimulation("conway");
      app.showLearnModal();
      await new Promise((r) => setTimeout(r, 50));
      const cModal = document.getElementById("dynamic-modal");
      const cTitle = cModal ? cModal.querySelector("h2")?.textContent || "" : "";
      const cOk = /Conway/i.test(cTitle);
      app.hideLearnModal();

      app.switchSimulation("termite");
      app.showLearnModal();
      await new Promise((r) => setTimeout(r, 50));
      const tModal = document.getElementById("dynamic-modal");
      const tTitle = tModal ? tModal.querySelector("h2")?.textContent || "" : "";
      const tOk = /Termite/i.test(tTitle);
      app.hideLearnModal();

      return { passed: cOk && tOk, details: `conway=${cOk}, termite=${tOk}` };
    },
    "ui"
  );
})();


