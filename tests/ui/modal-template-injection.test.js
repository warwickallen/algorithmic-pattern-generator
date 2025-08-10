(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Modal Template Manager - Content Injection",
    async () => {
      if (typeof ModalTemplateManager === "undefined") {
        return {
          skip: true,
          details: "Skipped: ModalTemplateManager not available",
        };
      }
      try {
        const mtm = new ModalTemplateManager();
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML =
          '<div class="modal-content"><div class="modal-header"><h2 data-modal-title></h2></div><div class="modal-body" data-modal-content></div></div>';

        const cOk = mtm.injectModalContent("conway", modal);
        const cTitle = modal.querySelector("h2")?.textContent || "";
        const cBody = modal.querySelector(".modal-body");
        const cNested = cBody
          ? cBody.querySelector(".modal-content") !== null
          : false;
        const cValid = cBody && !cNested && cBody.innerHTML.trim() !== "";

        const tOk = mtm.injectModalContent("termite", modal);
        const tTitle = modal.querySelector("h2")?.textContent || "";
        const tBody = modal.querySelector(".modal-body");
        const tNested = tBody
          ? tBody.querySelector(".modal-content") !== null
          : false;
        const tValid = tBody && !tNested && tBody.innerHTML.trim() !== "";

        const lOk = mtm.injectModalContent("langton", modal);
        const lTitle = modal.querySelector("h2")?.textContent || "";
        const lBody = modal.querySelector(".modal-body");
        const lNested = lBody
          ? lBody.querySelector(".modal-content") !== null
          : false;
        const lValid = lBody && !lNested && lBody.innerHTML.trim() !== "";

        mtm.cleanup();

        const ok =
          cOk &&
          tOk &&
          lOk &&
          cValid &&
          tValid &&
          lValid &&
          /Conway|Termite|Langton/.test(cTitle + tTitle + lTitle);
        return {
          passed: ok,
          details: ok ? "injection ok" : "injection failed",
        };
      } catch (e) {
        return { passed: false, details: e.message };
      }
    },
    "ui"
  );
})();
