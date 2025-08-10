(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Learn Modal Shows Correct Content for Current Simulation",
    async () => {
      if (typeof AlgorithmicPatternGenerator === "undefined") {
        return { skip: true, details: "Skipped: app not available" };
      }
      // Guard: app expects a canvas with id="canvas" present
      let created = false;
      if (!document.getElementById("canvas")) {
        const canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.width = 100;
        canvas.height = 100;
        document.body.appendChild(canvas);
        created = true;
      }
      const app = new AlgorithmicPatternGenerator();
      app.init();

      app.switchSimulation("conway");
      app.showLearnModal();
      await new Promise((r) => setTimeout(r, 50));
      const cModal = document.getElementById("dynamic-modal");
      const cTitle = cModal
        ? cModal.querySelector("h2")?.textContent || ""
        : "";
      const cOk = /Conway/i.test(cTitle);
      app.hideLearnModal();

      app.switchSimulation("termite");
      app.showLearnModal();
      await new Promise((r) => setTimeout(r, 50));
      const tModal = document.getElementById("dynamic-modal");
      const tTitle = tModal
        ? tModal.querySelector("h2")?.textContent || ""
        : "";
      const tOk = /Termite/i.test(tTitle);
      app.hideLearnModal();

      if (created) {
        const c = document.getElementById("canvas");
        if (c && c.parentNode) c.parentNode.removeChild(c);
      }
      return { passed: cOk && tOk, details: `conway=${cOk}, termite=${tOk}` };
    },
    "ui"
  );
})();
