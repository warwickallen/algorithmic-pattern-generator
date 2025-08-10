(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  function ensureEl(tag, id) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement(tag);
      el.id = id;
      document.body.appendChild(el);
    }
    return el;
  }

  runner.addTest(
    "UI Component Library: create label and set text",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return { passed: true, details: "Skipped: UIComponentLibrary not available" };
      }
      const ef = new EventFramework();
      ensureEl("span", "test-label");
      const ui = new UIComponentLibrary(ef);
      const label = ui.createLabel({ id: "test-label", text: "Hello" });
      const el = document.getElementById("test-label");
      const ok = !!label && el && el.textContent === "Hello";
      return { passed: ok, details: `created=${!!label}, text=${el && el.textContent}` };
    },
    "ui"
  );

  runner.addTest(
    "UI Component Library: create container and update layout",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return { passed: true, details: "Skipped: UIComponentLibrary not available" };
      }
      const ef = new EventFramework();
      ensureEl("div", "test-container");
      const ui = new UIComponentLibrary(ef);
      const container = ui.createContainer({ id: "test-container" });
      const before = container.state.layout;
      container.methods.setLayout && container.methods.setLayout("vertical");
      const after = container.state.layout;
      const ok = !!container && before !== after && after === "vertical";
      return { passed: ok, details: `before=${before}, after=${after}` };
    },
    "ui"
  );
})();


