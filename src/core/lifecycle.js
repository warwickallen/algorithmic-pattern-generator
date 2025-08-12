// Simulation Lifecycle Framework
class SimulationLifecycleFramework {
  constructor() {
    this.lifecycleHooks = new Map();
    this.stateManagers = new Map();
    this.eventHandlers = new Map();
  }

  registerLifecycleHooks(simulationId, hooks) {
    const defaultHooks = {
      onInit: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Simulation ${simulationId} initialized`)
          : void 0,
      onStart: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Simulation ${simulationId} started`)
          : void 0,
      onPause: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Simulation ${simulationId} paused`)
          : void 0,
      onReset: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Simulation ${simulationId} reset`)
          : void 0,
      onClear: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Simulation ${simulationId} cleared`)
          : void 0,
      onResize: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Simulation ${simulationId} resized`)
          : void 0,
      onUpdate: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Simulation ${simulationId} updated`)
          : void 0,
      onDraw: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Simulation ${simulationId} drawn`)
          : void 0,
      onDestroy: () =>
        typeof Logger !== "undefined"
          ? Logger.debug(`Simulation ${simulationId} destroyed`)
          : void 0,
    };

    this.lifecycleHooks.set(simulationId, { ...defaultHooks, ...hooks });
  }

  registerStateManager(simulationId, stateManager) {
    this.stateManagers.set(simulationId, stateManager);
  }

  registerEventHandlers(simulationId, handlers) {
    this.eventHandlers.set(simulationId, handlers);
  }

  executeHook(simulationId, hookName, ...args) {
    const hooks = this.lifecycleHooks.get(simulationId);
    if (hooks && hooks[hookName]) {
      try {
        return hooks[hookName](...args);
      } catch (error) {
        if (typeof errorHandler !== "undefined" && errorHandler.handle) {
          errorHandler.handle({
            type: "hook",
            simulationId,
            scope: hookName,
            message: `Error executing lifecycle hook`,
            error,
          });
        }
      }
    }
  }

  getStateManager(simulationId) {
    return this.stateManagers.get(simulationId);
  }

  getEventHandlers(simulationId) {
    return this.eventHandlers.get(simulationId);
  }

  createStateManager(initialState = {}) {
    return {
      state: { ...initialState },
      subscribers: new Set(),
      serializer: null,

      getState() {
        return { ...this.state };
      },

      setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
      },

      registerSerializer(serializer) {
        this.serializer = serializer;
      },

      hasSerializer() {
        return !!this.serializer;
      },

      serialize(simulationInstance) {
        if (this.serializer && typeof this.serializer.capture === "function") {
          try {
            return this.serializer.capture(simulationInstance) || {};
          } catch (error) {
            if (typeof errorHandler !== "undefined" && errorHandler.handle) {
              errorHandler.handle({
                type: "serialize",
                simulationId:
                  simulationInstance && simulationInstance.simulationId,
                scope: "StateManager.serialize",
                message: "Error capturing simulation state",
                error,
              });
            }
            return {};
          }
        }
        return {};
      },

      deserialize(simulationInstance, state) {
        if (this.serializer && typeof this.serializer.restore === "function") {
          try {
            this.serializer.restore(simulationInstance, state);
          } catch (error) {
            if (typeof errorHandler !== "undefined" && errorHandler.handle) {
              errorHandler.handle({
                type: "deserialize",
                simulationId:
                  simulationInstance && simulationInstance.simulationId,
                scope: "StateManager.deserialize",
                message: "Error restoring simulation state",
                error,
              });
            }
          }
        }
      },

      subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
      },

      notifySubscribers() {
        this.subscribers.forEach((callback) => {
          try {
            callback(this.state);
          } catch (error) {
            if (typeof errorHandler !== "undefined" && errorHandler.handle) {
              errorHandler.handle({
                type: "subscriber",
                simulationId: null,
                scope: "StateManager.notifySubscribers",
                message: "Error in state subscriber",
                error,
              });
            }
          }
        });
      },
    };
  }

  createEventHandler(simulationId = null) {
    return {
      events: new Map(),

      on(eventName, handler) {
        if (!this.events.has(eventName)) {
          this.events.set(eventName, []);
        }
        this.events.get(eventName).push(handler);
      },

      emit(eventName, ...args) {
        const handlers = this.events.get(eventName);
        if (handlers) {
          handlers.forEach((handler) => {
            try {
              handler(...args);
            } catch (error) {
              if (typeof errorHandler !== "undefined" && errorHandler.handle) {
                errorHandler.handle({
                  type: "eventHandler",
                  simulationId,
                  scope: eventName,
                  message: "Error in event handler",
                  error,
                });
              }
            }
          });
        }
      },

      off(eventName, handler) {
        const handlers = this.events.get(eventName);
        if (handlers) {
          const index = handlers.indexOf(handler);
          if (index > -1) {
            handlers.splice(index, 1);
          }
        }
      },
    };
  }

  cleanup() {
    this.lifecycleHooks.clear();
    this.stateManagers.clear();
    this.eventHandlers.clear();
  }
}

// Global instance and exposure
const simulationLifecycleFramework = new SimulationLifecycleFramework();
if (typeof window !== "undefined") {
  window.SimulationLifecycleFramework = SimulationLifecycleFramework;
  window.simulationLifecycleFramework = simulationLifecycleFramework;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SimulationLifecycleFramework,
    simulationLifecycleFramework,
  };
}
