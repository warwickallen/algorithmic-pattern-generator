(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  function createTestElement(classes = "") {
    const el = document.createElement("div");
    el.className = classes;
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.style.top = "-9999px";
    document.body.appendChild(el);
    return el;
  }

  function cleanup(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  runner.addTest(
    "CSS Design Tokens are defined",
    async () => {
      if (typeof getComputedStyle === "undefined") {
        return { passed: true, details: "Skipped: no DOM environment" };
      }
      const cs = getComputedStyle(document.documentElement);
      const vars = [
        "--color-primary",
        "--color-secondary",
        "--color-background",
        "--spacing-sm",
        "--spacing-md",
        "--radius-md",
        "--transition-normal",
        "--z-controls",
      ];
      const missing = vars.filter((v) => !cs.getPropertyValue(v).trim());
      return {
        passed: missing.length === 0,
        details:
          missing.length === 0
            ? "all required CSS variables present"
            : `missing: ${missing.join(", ")}`,
      };
    },
    "ui.css"
  );

  runner.addTest(
    "Glass effect utilities apply styles",
    async () => {
      if (typeof getComputedStyle === "undefined") {
        return { passed: true, details: "Skipped: no DOM environment" };
      }
      const glass = createTestElement("glass");
      const glassLight = createTestElement("glass-light");
      try {
        const s1 = getComputedStyle(glass);
        const s2 = getComputedStyle(glassLight);
        // Use stable indicators that don't vary across browsers
        const hasBorder = (s) => (s.borderStyle || s.border).includes("solid");
        const hasBoxShadow = (s) => !!(s.boxShadow && s.boxShadow !== "none");
        const ok = hasBorder(s1) && hasBorder(s2) && hasBoxShadow(s1);
        return { passed: ok, details: `border+shadow ok=${ok}` };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        cleanup(glass);
        cleanup(glassLight);
      }
    },
    "ui.css"
  );

  runner.addTest(
    "Utility classes (flex, spacing, z-index) basic behaviour",
    async () => {
      if (typeof getComputedStyle === "undefined") {
        return { passed: true, details: "Skipped: no DOM environment" };
      }
      const el = createTestElement("flex flex-center gap-sm z-controls p-md");
      try {
        const hasClasses = [
          "flex",
          "flex-center",
          "gap-sm",
          "z-controls",
          "p-md",
        ].every((c) => el.classList.contains(c));
        const style = getComputedStyle(el);
        const isFlex = style.display === "flex";
        const hasGap = !!style.gap && style.gap !== "0px";
        const ok = hasClasses && isFlex && hasGap;
        return { passed: ok, details: `flex=${isFlex}, gap=${style.gap}` };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        cleanup(el);
      }
    },
    "ui.css"
  );
})();
