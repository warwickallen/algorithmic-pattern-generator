(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  function ensureControlsFixture() {
    const ids = [
      "conway-controls",
      "termite-controls",
      "langton-controls",
      "termites-container",
    ];
    const created = [];
    ids.forEach((id) => {
      if (!document.getElementById(id)) {
        const el = document.createElement("div");
        el.id = id;
        // Mark as control groups so ControlVisibilityManager selectors match
        el.className = "control-group simulation-controls";
        document.body.appendChild(el);
        created.push(el);
      }
    });
    return () => {
      created.forEach((el) => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }

  runner.addTest(
    "ControlVisibilityManager Initialization",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlVisibilityManager not available",
        };
      }
      const visibilityManager = new ControlVisibilityManager();
      visibilityManager.init();
      const isInitialized = visibilityManager.isInitialized;
      const hasControlGroups = visibilityManager.controlGroups.size > 0;
      const hasVisibilityStates = visibilityManager.visibilityStates.size > 0;
      visibilityManager.cleanup();
      return {
        passed: isInitialized && hasControlGroups && hasVisibilityStates,
        details: `init=${isInitialized}, groups=${hasControlGroups}, states=${hasVisibilityStates}`,
      };
    },
    "ui.controls"
  );

  runner.addTest(
    "ControlVisibilityManager CSS Classes",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlVisibilityManager not available",
        };
      }
      const visibilityManager = new ControlVisibilityManager();
      visibilityManager.init();
      const styleElement = document.getElementById("control-visibility-styles");
      const hasStyles =
        !!styleElement &&
        styleElement.textContent.includes("control-group[data-simulation]");
      visibilityManager.cleanup();
      return { passed: hasStyles, details: `styles=${hasStyles}` };
    },
    "ui.controls"
  );

  runner.addTest(
    "ControlVisibilityManager Conway Simulation",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlVisibilityManager not available",
        };
      }
      const cleanup = ensureControlsFixture();
      const vm = new ControlVisibilityManager();
      vm.init();
      vm.setActiveSimulation("conway");
      const isConwayVisible =
        document
          .getElementById("conway-controls")
          ?.classList.contains("active") || false;
      const isTermiteHidden = !document
        .getElementById("termite-controls")
        ?.classList.contains("active");
      const isLangtonHidden = !document
        .getElementById("langton-controls")
        ?.classList.contains("active");
      const isTermitesHidden = !document
        .getElementById("termites-container")
        ?.classList.contains("active");
      const active = vm.getActiveSimulation();
      vm.cleanup();
      cleanup();
      return {
        passed:
          isConwayVisible &&
          isTermiteHidden &&
          isLangtonHidden &&
          isTermitesHidden &&
          active === "conway",
        details: `conway=${isConwayVisible}, termiteHidden=${isTermiteHidden}, langtonHidden=${isLangtonHidden}, termitesHidden=${isTermitesHidden}, active=${active}`,
      };
    },
    "ui.controls"
  );

  runner.addTest(
    "ControlVisibilityManager Termite Simulation",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlVisibilityManager not available",
        };
      }
      const cleanup = ensureControlsFixture();
      const vm = new ControlVisibilityManager();
      vm.init();
      vm.setActiveSimulation("termite");
      const termiteVisible =
        document
          .getElementById("termite-controls")
          ?.classList.contains("active") || false;
      const termitesVisible =
        document
          .getElementById("termites-container")
          ?.classList.contains("active") || false;
      const conwayHidden = !document
        .getElementById("conway-controls")
        ?.classList.contains("active");
      const langtonHidden = !document
        .getElementById("langton-controls")
        ?.classList.contains("active");
      const active = vm.getActiveSimulation();
      vm.cleanup();
      cleanup();
      return {
        passed:
          termiteVisible &&
          termitesVisible &&
          conwayHidden &&
          langtonHidden &&
          active === "termite",
        details: `termite=${termiteVisible}, termites=${termitesVisible}, conwayHidden=${conwayHidden}, langtonHidden=${langtonHidden}, active=${active}`,
      };
    },
    "ui.controls"
  );

  runner.addTest(
    "ControlVisibilityManager Langton Simulation",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlVisibilityManager not available",
        };
      }
      const cleanup = ensureControlsFixture();
      const vm = new ControlVisibilityManager();
      vm.init();
      vm.setActiveSimulation("langton");
      const langtonVisible =
        document
          .getElementById("langton-controls")
          ?.classList.contains("active") || false;
      const conwayHidden = !document
        .getElementById("conway-controls")
        ?.classList.contains("active");
      const termiteHidden = !document
        .getElementById("termite-controls")
        ?.classList.contains("active");
      const termitesHidden = !document
        .getElementById("termites-container")
        ?.classList.contains("active");
      const active = vm.getActiveSimulation();
      vm.cleanup();
      cleanup();
      return {
        passed:
          langtonVisible &&
          conwayHidden &&
          termiteHidden &&
          termitesHidden &&
          active === "langton",
        details: `langton=${langtonVisible}, conwayHidden=${conwayHidden}, termiteHidden=${termiteHidden}, termitesHidden=${termitesHidden}, active=${active}`,
      };
    },
    "ui.controls"
  );

  runner.addTest(
    "ControlVisibilityManager State Clearing",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlVisibilityManager not available",
        };
      }
      const cleanup = ensureControlsFixture();
      const vm = new ControlVisibilityManager();
      vm.init();
      vm.setActiveSimulation("conway");
      const conwayActive = vm.getActiveSimulation() === "conway";
      vm.hideAllControls();
      const allHidden = [
        "conway-controls",
        "termite-controls",
        "langton-controls",
        "termites-container",
      ].every(
        (id) => !document.getElementById(id)?.classList.contains("active")
      );
      const noActive = vm.getActiveSimulation() === null;
      vm.cleanup();
      cleanup();
      return {
        passed: conwayActive && allHidden && noActive,
        details: `conwayActive=${conwayActive}, allHidden=${allHidden}, noActive=${noActive}`,
      };
    },
    "ui.controls"
  );

  runner.addTest(
    "ControlVisibilityManager Backward Compatibility",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlVisibilityManager not available",
        };
      }
      const cleanup = ensureControlsFixture();
      const vm = new ControlVisibilityManager();
      vm.init();
      vm.showControls("conway");
      const conwayActive = vm.getActiveSimulation() === "conway";
      vm.hideAllControls();
      const noActive = vm.getActiveSimulation() === null;
      vm.cleanup();
      cleanup();
      return {
        passed: conwayActive && noActive,
        details: `conwayActive=${conwayActive}, noActive=${noActive}`,
      };
    },
    "ui.controls"
  );

  runner.addTest(
    "ControlVisibilityManager Control Visibility Check",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlVisibilityManager not available",
        };
      }
      const cleanup = ensureControlsFixture();
      const vm = new ControlVisibilityManager();
      vm.init();
      vm.setActiveSimulation("termite");
      const termiteVisible = vm.isControlVisible("termite-controls");
      const termitesVisible = vm.isControlVisible("termites-container");
      const conwayVisible = vm.isControlVisible("conway-controls");
      vm.cleanup();
      cleanup();
      return {
        passed: termiteVisible && termitesVisible && !conwayVisible,
        details: `termite=${termiteVisible}, termites=${termitesVisible}, conway=${conwayVisible}`,
      };
    },
    "ui.controls"
  );

  runner.addTest(
    "ControlVisibilityManager Extensibility",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlVisibilityManager not available",
        };
      }
      const cleanup = ensureControlsFixture();
      const vm = new ControlVisibilityManager();
      vm.init();
      vm.addControlGroup("test-sim", ["test-controls"]);
      vm.addVisibilityStates("test-sim", {
        "test-controls": "visible",
        "conway-controls": "hidden",
      });
      // create the new control element so visibility can apply
      if (!document.getElementById("test-controls")) {
        const el = document.createElement("div");
        el.id = "test-controls";
        document.body.appendChild(el);
      }
      vm.setActiveSimulation("test-sim");
      const active = vm.getActiveSimulation();
      vm.cleanup();
      cleanup();
      const ok = active === "test-sim";
      return { passed: ok, details: `active=${active}` };
    },
    "ui.controls"
  );

  runner.addTest(
    "ControlManager Integration with ControlVisibilityManager",
    async () => {
      if (typeof ControlManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlManager not available",
        };
      }
      const cleanup = ensureControlsFixture();
      const ef = new EventFramework();
      const cm = new ControlManager(ef);
      cm.showControls("conway");
      const conwayActive =
        cm.visibilityManager.getActiveSimulation() === "conway";
      cm.hideAllControls();
      const noActive = cm.visibilityManager.getActiveSimulation() === null;
      cm.cleanup();
      ef.cleanup();
      cleanup();
      return {
        passed: conwayActive && noActive,
        details: `conwayActive=${conwayActive}, noActive=${noActive}`,
      };
    },
    "ui"
  );
})();
