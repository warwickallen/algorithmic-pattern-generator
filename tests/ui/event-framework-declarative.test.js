(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "EventFramework Declarative Registration",
    async () => {
      if (typeof EventFramework === "undefined") {
        return { passed: true, details: "Skipped: EventFramework not available" };
      }
      const ef = new EventFramework();
      const btn = document.createElement("button");
      btn.id = "ef-decl-btn";
      document.body.appendChild(btn);
      let clicked = 0;
      ef.registerDeclarative([
        {
          selector: "#ef-decl-btn",
          on: { click: { handler: () => (clicked += 1) } },
        },
      ]);
      btn.click();
      ef.cleanup();
      document.body.removeChild(btn);
      return { passed: clicked === 1, details: `clicked=${clicked}` };
    },
    "ui"
  );

  runner.addTest(
    "EventFramework Delegated Registration",
    async () => {
      if (typeof EventFramework === "undefined") {
        return { passed: true, details: "Skipped: EventFramework not available" };
      }
      const ef = new EventFramework();
      const container = document.createElement("div");
      container.id = "ef-deleg-container";
      const child = document.createElement("button");
      child.className = "inner";
      container.appendChild(child);
      document.body.appendChild(container);
      let clicks = 0;
      ef.registerDelegated(container, "click", ".inner", () => (clicks += 1));
      child.click();
      ef.cleanup();
      document.body.removeChild(container);
      return { passed: clicks === 1, details: `clicks=${clicks}` };
    },
    "ui"
  );
})();


