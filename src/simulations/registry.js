// Simulation Registry for plug-in architecture
(function () {
  const API_VERSION = "1.0.0";

  function isNonEmptyString(v) {
    return typeof v === "string" && v.trim().length > 0;
  }

  class SimulationRegistry {
    constructor() {
      this.plugins = new Map();
    }

    register(plugin) {
      try {
        if (!plugin || typeof plugin !== "object") {
          console.warn("registerSimulation: invalid plugin object");
          return false;
        }
        const { id, apiVersion, create } = plugin;
        if (!isNonEmptyString(id)) {
          console.warn("registerSimulation: missing or invalid id");
          return false;
        }
        if (!isNonEmptyString(apiVersion)) {
          console.warn(`registerSimulation(${id}): missing apiVersion`);
          return false;
        }
        if (typeof create !== "function") {
          console.warn(`registerSimulation(${id}): missing create function`);
          return false;
        }
        if (this.plugins.has(id)) {
          console.warn(`registerSimulation: duplicate id '${id}' rejected`);
          return false;
        }
        // Shallow clone and canonicalise optional metadata
        const canonical = {
          id,
          apiVersion,
          displayNameKey: plugin.displayNameKey || id,
          create,
          capabilities: plugin.capabilities || {},
          defaults: plugin.defaults || {},
          ui: plugin.ui || {},
          handlers: plugin.handlers || {},
          errorStrategy: plugin.errorStrategy || null,
        };

        this.plugins.set(id, canonical);
        // Register error strategy if provided
        if (
          canonical.errorStrategy &&
          typeof window !== "undefined" &&
          window.errorHandler &&
          typeof window.errorHandler.registerStrategy === "function"
        ) {
          window.errorHandler.registerStrategy(id, canonical.errorStrategy);
        }
        return true;
      } catch (e) {
        console.error("registerSimulation: unexpected error", e);
        return false;
      }
    }

    has(id) {
      return this.plugins.has(id);
    }

    get(id) {
      return this.plugins.get(id) || null;
    }

    list() {
      return Array.from(this.plugins.keys());
    }

    create(id, canvas, ctx) {
      const plugin = this.get(id);
      if (!plugin) throw new Error(`Unknown simulation id: ${id}`);
      const instance = plugin.create(canvas, ctx);
      return instance;
    }
  }

  const registry = new SimulationRegistry();

  function registerSimulation(plugin) {
    return registry.register(plugin);
  }

  if (typeof window !== "undefined") {
    window.SimulationRegistry = registry;
    window.registerSimulation = registerSimulation;
    window.listRegisteredSimulations = () => registry.list();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { SimulationRegistry: registry, registerSimulation };
  }
})();
