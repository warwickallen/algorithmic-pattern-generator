(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "UnifiedModalSystem opens custom content",
    async () => {
      if (typeof UnifiedModalSystem === "undefined") {
        return { passed: true, details: "Skipped: UnifiedModalSystem not available" };
      }
      const modalEl = document.getElementById("dynamic-modal");
      if (!modalEl) {
        return { passed: false, details: "dynamic-modal not found in DOM" };
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
      const contentOk = !!bodyEl && bodyEl.innerHTML.includes("Custom body content");
      modalSystem.close();
      return { passed: visible && titleOk && contentOk, details: `visible:${visible}, title:${titleOk}, content:${contentOk}` };
    },
    "ui"
  );
})();


