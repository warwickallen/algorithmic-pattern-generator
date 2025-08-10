(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Modal Management",
    async () => {
      if (typeof document === "undefined") {
        return { passed: true, details: "Skipped: no DOM" };
      }
      const modalManager = new ModalManager();
      const modal = document.createElement("div");
      modal.id = "test-modal";
      modal.className = "modal";
      modal.innerHTML =
        '<div class="modal-content"><button class="modal-close">&times;</button></div>';
      document.body.appendChild(modal);
      modalManager.register("test-modal");
      modalManager.show("test-modal");
      await new Promise((r) => requestAnimationFrame(r));
      const isVisible = modalManager.isVisible("test-modal");
      document.body.removeChild(modal);
      return { passed: isVisible, details: `visible=${isVisible}` };
    },
    "integration"
  );
})();
