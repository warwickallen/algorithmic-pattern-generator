(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Modal Template Manager - HTML Generation",
    async () => {
      if (typeof ModalTemplateManager === "undefined") {
        return {
          skip: true,
          details: "Skipped: ModalTemplateManager not available",
        };
      }
      try {
        const mtm = new ModalTemplateManager();
        const conwayHTML = mtm.generateModalHTML("conway");
        const termiteHTML = mtm.generateModalHTML("termite");
        const langtonHTML = mtm.generateModalHTML("langton");

        const hasConway =
          conwayHTML &&
          conwayHTML.includes('id="conway-modal"') &&
          conwayHTML.includes('class="modal"');
        const hasTermite =
          termiteHTML &&
          termiteHTML.includes('id="termite-modal"') &&
          termiteHTML.includes('class="modal"');
        const hasLangton =
          langtonHTML &&
          langtonHTML.includes('id="langton-modal"') &&
          langtonHTML.includes('class="modal"');

        mtm.cleanup();
        const ok = !!(hasConway && hasTermite && hasLangton);
        return {
          passed: ok,
          details: ok ? "HTML generated" : "Missing HTML structure",
        };
      } catch (e) {
        return { passed: false, details: e.message };
      }
    },
    "ui"
  );
})();
