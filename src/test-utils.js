/**
 * TestUtilityFactory
 * Centralised helpers for creating common test fixtures:
 * - Mock canvas and 2D context for headless tests
 * - Real canvas in DOM for browser tests
 * - Convenience creators for simulations with provided mocks
 */
(function(factory){
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof window !== 'undefined') {
    window.TestUtilityFactory = factory();
  }
})(function() {
  function createMockCanvas(width = 300, height = 300) {
    return {
      width,
      height,
      getBoundingClientRect: () => ({ left: 0, top: 0, width, height }),
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }

  function createMockContext(overrides = {}) {
    const ctx = {
      fillStyle: '',
      shadowColor: 'transparent',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      beginPath: () => {},
      arc: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fillRect: () => {},
      clearRect: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      rotate: () => {},
      fill: () => {},
      getImageData: () => ({ data: [] }),
    };
    // Optional shimmer API used by code under test
    ctx.setGlowEffect = ctx.setGlowEffect || (() => {});
    ctx.clearGlowEffect = ctx.clearGlowEffect || (() => {});
    return { ...ctx, ...overrides };
  }

  function createDOMCanvas(width = 300, height = 300) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function createCanvasAndContext({ useDOM = false, width = 300, height = 300, ctxOverrides = {} } = {}) {
    if (useDOM && typeof document !== 'undefined') {
      const canvas = createDOMCanvas(width, height);
      const ctx = (canvas && canvas.getContext) ? canvas.getContext('2d') : null;
      return { canvas, ctx };
    }
    const canvas = createMockCanvas(width, height);
    const ctx = createMockContext(ctxOverrides);
    return { canvas, ctx };
  }

  function createSimulationWithMocks(type, options = {}) {
    const { canvas, ctx } = createCanvasAndContext(options);
    if (typeof SimulationFactory === 'undefined') {
      throw new Error('SimulationFactory is not available in this environment');
    }
    const sim = SimulationFactory.createSimulation(type, canvas, ctx);
    return { simulation: sim, canvas, ctx };
  }

  function withTempElement(tagName, attributes = {}, callback) {
    if (typeof document === 'undefined') return null;
    const el = document.createElement(tagName);
    Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
    document.body.appendChild(el);
    try {
      return callback(el);
    } finally {
      if (el.parentNode) el.parentNode.removeChild(el);
    }
  }

  return {
    createMockCanvas,
    createMockContext,
    createDOMCanvas,
    createCanvasAndContext,
    createSimulationWithMocks,
    withTempElement,
  };
});


