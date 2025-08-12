// Centralised runtime type guards and helpers
(function (factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof window !== "undefined") {
    window.TypeGuards = factory();
  }
})(function () {
  const isNumber = (v) => typeof v === "number" && !Number.isNaN(v);
  const isFiniteNumber = (v) => isNumber(v) && Number.isFinite(v);
  const isInteger = (v) => Number.isInteger(v);
  const isString = (v) => typeof v === "string";
  const isBoolean = (v) => typeof v === "boolean";
  const isFunction = (v) => typeof v === "function";
  const isObject = (v) =>
    v !== null && typeof v === "object" && !Array.isArray(v);
  const isArray = Array.isArray;
  const isElement = (v) =>
    typeof Element !== "undefined"
      ? v instanceof Element
      : !!(v && v.nodeType === 1);

  const toNumber = (v, fallback = 0) => {
    if (isNumber(v)) return v;
    const n = typeof v === "string" ? parseFloat(v) : Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const clampNumber = (v, min, max) => {
    const n = toNumber(v, min);
    return Math.max(min, Math.min(max, n));
  };

  const inRange = (v, min, max) => {
    const n = toNumber(v, NaN);
    return Number.isFinite(n) && n >= min && n <= max;
  };

  const hasProps = (obj, props) => {
    if (!isObject(obj) || !isArray(props)) return false;
    return props.every((p) => Object.prototype.hasOwnProperty.call(obj, p));
  };

  return {
    isNumber,
    isFiniteNumber,
    isInteger,
    isString,
    isBoolean,
    isFunction,
    isObject,
    isArray,
    isElement,
    toNumber,
    clampNumber,
    inRange,
    hasProps,
  };
});
