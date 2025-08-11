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
      let createdModal = false;
      let createdFillBtn = false;
      if (!document.getElementById("canvas")) {
        const canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.width = 100;
        canvas.height = 100;
        document.body.appendChild(canvas);
        created = true;
      }
      // Ensure dynamic modal mount exists for registration/injection
      let mount = document.getElementById("dynamic-modal");
      if (!mount) {
        mount = document.createElement("div");
        mount.id = "dynamic-modal";
        mount.className = "modal";
        mount.innerHTML =
          '<div class="modal-content"><div class="modal-header"><h2 data-modal-title></h2><button class="modal-close">&times;</button></div><div class="modal-body" data-modal-content></div></div>';
        document.body.appendChild(mount);
        createdModal = true;
      }
      // Ensure dynamic fill button exists to avoid init warnings in app
      if (!document.getElementById("dynamic-fill-btn")) {
        const btn = document.createElement("button");
        btn.id = "dynamic-fill-btn";
        btn.style.display = "none";
        document.body.appendChild(btn);
        createdFillBtn = true;
      }
      const app = new AlgorithmicPatternGenerator();
      app.init();

      app.switchSimulation("conway");
      app.showLearnModal();
      await new Promise((r) => setTimeout(r, 100));
      const cModal = document.getElementById("dynamic-modal");
      const cTitle = cModal
        ? cModal.querySelector("h2")?.textContent || ""
        : "";
      const cOk = /Conway/i.test(cTitle);
      app.hideLearnModal();

      app.switchSimulation("termite");
      app.showLearnModal();
      await new Promise((r) => setTimeout(r, 100));
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
      if (createdModal && mount && mount.parentNode) {
        mount.parentNode.removeChild(mount);
      }
      if (createdFillBtn) {
        const b = document.getElementById("dynamic-fill-btn");
        if (b && b.parentNode) b.parentNode.removeChild(b);
      }
      return { passed: cOk && tOk, details: `conway=${cOk}, termite=${tOk}` };
    },
    "ui.modal"
  );
})();
