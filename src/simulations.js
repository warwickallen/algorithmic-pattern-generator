// Legacy SimulationFactory shim for backwards compatibility with plug-in system
class SimulationFactory {
  static createSimulation(type, canvas, ctx) {
    if (typeof window !== 'undefined' && window.SimulationRegistry && window.SimulationRegistry.has(type)) {
      return window.SimulationRegistry.create(type, canvas, ctx);
    }
    throw new Error(`Unknown simulation type: ${type}`);
  }
}

if (typeof window !== 'undefined') {
  window.SimulationFactory = SimulationFactory;
}