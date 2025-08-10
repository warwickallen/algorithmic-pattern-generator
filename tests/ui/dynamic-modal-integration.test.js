(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Dynamic Modal System - Integration",
    async () => {
      if (typeof ModalManager === "undefined") {
        return { skip: true, details: "Skipped: ModalManager not available" };
      }
      try {
        const modalManager = new ModalManager();
        const regC = modalManager.registerDynamicModal("conway");
        const regT = modalManager.registerDynamicModal("termite");
        const regL = modalManager.registerDynamicModal("langton");
        const regInvalid = modalManager.registerDynamicModal("invalid");

        modalManager.show(modalManager.dynamicModalId, "conway");
        await new Promise((r) => setTimeout(r, 50));
        const cVisible = document.getElementById("dynamic-modal")?.classList.contains("show");
        const cTitle = document.getElementById("dynamic-modal")?.querySelector("h2")?.textContent || "";
        modalManager.hide(modalManager.dynamicModalId);
        await new Promise((r) => setTimeout(r, 50));

        modalManager.show(modalManager.dynamicModalId, "termite");
        await new Promise((r) => setTimeout(r, 50));
        const tVisible = document.getElementById("dynamic-modal")?.classList.contains("show");
        const tTitle = document.getElementById("dynamic-modal")?.querySelector("h2")?.textContent || "";
        modalManager.hide(modalManager.dynamicModalId);

        const registrationOk = regC && regT && regL && !regInvalid;
        const contentOk = cVisible && tVisible && /Conway/.test(cTitle) && /Termite/.test(tTitle);

        modalManager.cleanup();
        return { passed: registrationOk && contentOk, details: registrationOk && contentOk ? "ok" : "failed" };
      } catch (e) {
        return { passed: false, details: e.message };
      }
    },
    "ui"
  );
})();


