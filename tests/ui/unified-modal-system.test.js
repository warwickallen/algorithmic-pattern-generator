(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "UnifiedModalSystem opens custom content",
    async () => {
      if (typeof UnifiedModalSystem === "undefined") {
        return {
          passed: true,
          details: "Skipped: UnifiedModalSystem not available",
        };
      }
      let created = false;
      let modalEl = document.getElementById("dynamic-modal");
      if (!modalEl) {
        modalEl = document.createElement("div");
        modalEl.id = "dynamic-modal";
        modalEl.className = "modal";
        modalEl.innerHTML =
          '<div class="modal-content"><div class="modal-header"><h2 data-modal-title></h2><button class="modal-close">&times;</button></div><div class="modal-body" data-modal-content></div></div>';
        document.body.appendChild(modalEl);
        created = true;
      }
      const modalSystem = new UnifiedModalSystem();
      const customTitle = "Custom Modal Title";
      const customContent = "<p>Custom body content</p>";
      modalSystem.openCustom(customTitle, customContent);
      await new Promise((r) => setTimeout(r, 60));
      const titleEl = modalEl.querySelector("[data-modal-title]");
      const bodyEl = modalEl.querySelector("[data-modal-content]");
      const visible = modalEl.classList.contains("show");
      const titleOk = !!titleEl && titleEl.textContent === customTitle;
      const contentOk =
        !!bodyEl && bodyEl.innerHTML.includes("Custom body content");
      modalSystem.close();
      if (created && modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
      return {
        passed: visible && titleOk && contentOk,
        details: `visible:${visible}, title:${titleOk}, content:${contentOk}`,
      };
    },
    "ui"
  );
})();
