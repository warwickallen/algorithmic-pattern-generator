// Lightweight actor class hierarchy for shared properties/behaviour
// Attached to window for browser environments; safely no-op in Node if not loaded

(function (global) {
  class Actor {
    constructor(x = 0, y = 0, options = {}) {
      this.x = x;
      this.y = y;
      this.speed = typeof options.speed === "number" ? options.speed : 0;
      this.trail = Array.isArray(options.trail) ? options.trail : [];
      this.isCarrying = !!options.isCarrying;
    }

    updateTrail(simulation, x, y) {
      if (simulation && typeof simulation.updateActorTrail === "function") {
        simulation.updateActorTrail(this, x, y);
      }
    }

    drawTrail(simulation, radius = 2) {
      if (simulation && typeof simulation.drawActorTrail === "function") {
        simulation.drawActorTrail(this, radius);
      }
    }
  }

  class GridActor extends Actor {
    constructor(x = 0, y = 0, direction = 0, options = {}) {
      super(x, y, options);
      this.direction = direction % 4;
    }
  }

  class ContinuousActor extends Actor {
    constructor(x = 0, y = 0, angle = 0, options = {}) {
      super(x, y, options);
      this.angle = angle;
    }
  }

  global.Actor = Actor;
  global.GridActor = GridActor;
  global.ContinuousActor = ContinuousActor;
})(typeof window !== "undefined" ? window : globalThis);
