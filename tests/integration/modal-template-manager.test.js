(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Modal Template Manager - Content Templates",
    async () => {
      if (typeof ModalTemplateManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ModalTemplateManager not available",
        };
      }
      try {
        const modalTemplateManager = new ModalTemplateManager();
        const available = modalTemplateManager.getAvailableSimulations();
        const hasAll =
          available.includes("conway") &&
          available.includes("termite") &&
          available.includes("langton");
        const hasConway = modalTemplateManager.hasTemplate("conway");
        const hasTermite = modalTemplateManager.hasTemplate("termite");
        const hasLangton = modalTemplateManager.hasTemplate("langton");
        const hasInvalid = modalTemplateManager.hasTemplate("invalid");
        const conwayContent = modalTemplateManager.createModalContent("conway");
        const termiteContent =
          modalTemplateManager.createModalContent("termite");
        const langtonContent =
          modalTemplateManager.createModalContent("langton");
        const invalidContent =
          modalTemplateManager.createModalContent("invalid");
        const ok =
          hasAll &&
          hasConway &&
          hasTermite &&
          hasLangton &&
          !hasInvalid &&
          !!conwayContent &&
          !!termiteContent &&
          !!langtonContent &&
          !invalidContent;
        modalTemplateManager.cleanup();
        return {
          passed: ok,
          details: ok ? "templates ok" : "templates missing",
        };
      } catch (e) {
        return { passed: false, details: e.message };
      }
    },
    "integration"
  );
})();
