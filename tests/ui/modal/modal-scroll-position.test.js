(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Modal Scroll Position Management",
    async () => {
      if (typeof ModalManager === "undefined") {
        return { passed: true, details: "Skipped: ModalManager not available" };
      }

      let mount = document.getElementById("dynamic-modal");
      let created = false;
      if (!mount) {
        mount = document.createElement("div");
        mount.id = "dynamic-modal";
        mount.className = "modal";
        mount.innerHTML =
          '<div class="modal-content"><div class="modal-header"><h2 data-modal-title></h2><button class="modal-close">&times;</button></div><div class="modal-body" data-modal-content></div></div>';
        document.body.appendChild(mount);
        created = true;
      }

      const modalManager = new ModalManager();
      modalManager.register("dynamic-modal");

      modalManager.show("dynamic-modal", "conway");
      await new Promise((r) => setTimeout(r, 100));
      const conwayModal = document.getElementById("dynamic-modal");
      const conwayBody = conwayModal
        ? conwayModal.querySelector(".modal-body")
        : null;
      if (!conwayBody) {
        modalManager.cleanup();
        return { passed: false, details: "Modal body not found" };
      }
      conwayBody.scrollTop = 100;
      const conwayScrollPosition = conwayBody.scrollTop;

      modalManager.show("dynamic-modal", "termite");
      await new Promise((r) => setTimeout(r, 100));
      const termiteModal = document.getElementById("dynamic-modal");
      const termiteBody = termiteModal
        ? termiteModal.querySelector(".modal-body")
        : null;
      if (!termiteBody) {
        modalManager.cleanup();
        return { passed: false, details: "Termite modal body not found" };
      }
      termiteBody.scrollTop = 200;
      const termiteScrollPosition = termiteBody.scrollTop;

      modalManager.show("dynamic-modal", "conway");
      await new Promise((r) => setTimeout(r, 100));
      const restoredConwayBody = document
        .getElementById("dynamic-modal")
        ?.querySelector(".modal-body");
      const conwayScrollRestored = restoredConwayBody
        ? restoredConwayBody.scrollTop === conwayScrollPosition
        : false;

      modalManager.show("dynamic-modal", "termite");
      await new Promise((r) => setTimeout(r, 100));
      const restoredTermiteBody = document
        .getElementById("dynamic-modal")
        ?.querySelector(".modal-body");
      const termiteScrollRestored = restoredTermiteBody
        ? restoredTermiteBody.scrollTop === termiteScrollPosition
        : false;

      modalManager.show("dynamic-modal", "langton");
      await new Promise((r) => setTimeout(r, 100));
      const langtonBody = document
        .getElementById("dynamic-modal")
        ?.querySelector(".modal-body");
      const langtonInitialScroll = langtonBody
        ? langtonBody.scrollTop === 0
        : false;

      modalManager.cleanup();
      if (created && mount.parentNode) mount.parentNode.removeChild(mount);
      return {
        passed:
          conwayScrollRestored && termiteScrollRestored && langtonInitialScroll,
        details: `Conway restored: ${conwayScrollRestored}, Termite restored: ${termiteScrollRestored}, Langton initial: ${langtonInitialScroll}`,
      };
    },
    "ui.modal"
  );
})();
