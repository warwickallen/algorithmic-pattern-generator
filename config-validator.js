// Generic configuration validator with rule-based schemas
// Exposes global ConfigValidator (browser) and CommonJS export (tests/node)

(function (factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else if (typeof window !== "undefined") {
    window.ConfigValidator = factory();
  }
})(function () {
  function typeOf(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  }

  function get(obj, path) {
    if (!path) return obj;
    const parts = path.split(".");
    let cur = obj;
    for (const part of parts) {
      if (cur == null) return undefined;
      cur = cur[part];
    }
    return cur;
  }

  class ConfigValidatorClass {
    constructor() {
      this.schemas = new Map();
      this.customRules = new Map();

      // Built-in primitive rules
      this.registerRule(
        "required",
        (value, flag) => {
          if (!flag) return true;
          return value !== undefined;
        },
        "is required"
      );

      this.registerRule(
        "type",
        (value, expected) => {
          if (value === undefined) return true; // let required handle absence
          const t = typeOf(value);
          if (expected === "integer") {
            return Number.isInteger(value);
          }
          if (expected === "finite") {
            return Number.isFinite(value);
          }
          if (Array.isArray(expected)) {
            return expected.includes(t);
          }
          return t === expected;
        },
        (exp) => `must be of type ${Array.isArray(exp) ? exp.join("|") : exp}`
      );

      this.registerRule(
        "min",
        (value, min) => {
          if (value === undefined) return true;
          return typeof value === "number" && value >= min;
        },
        (min) => `must be >= ${min}`
      );

      this.registerRule(
        "max",
        (value, max) => {
          if (value === undefined) return true;
          return typeof value === "number" && value <= max;
        },
        (max) => `must be <= ${max}`
      );

      this.registerRule(
        "oneOf",
        (value, list) => {
          if (value === undefined) return true;
          return list.includes(value);
        },
        (list) => `must be one of: ${list.join(", ")}`
      );

      this.registerRule(
        "predicate",
        (value, fn) => {
          if (value === undefined) return true;
          try {
            return !!fn(value);
          } catch {
            return false;
          }
        },
        "failed predicate"
      );

      // Register built-in schemas
      this.registerDefaultSchemas();
    }

    registerRule(name, fn, message) {
      this.customRules.set(name, { fn, message });
    }

    registerSchema(type, schema) {
      this.schemas.set(type, schema);
    }

    registerDefaultSchemas() {
      // Slider
      this.registerSchema("slider", {
        fields: [
          { path: "type", rules: { required: true, oneOf: ["slider"] } },
          { path: "id", rules: { required: true, type: "string" } },
          { path: "valueElementId", rules: { required: true, type: "string" } },
          { path: "min", rules: { required: true, type: "finite" } },
          { path: "max", rules: { required: true, type: "finite" } },
          { path: "step", rules: { required: true, type: "finite" } },
          { path: "value", rules: { required: true, type: "finite" } },
          { path: "label", rules: { required: true, type: "string" } },
          { path: "format", rules: { type: ["function", "undefined"] } },
        ],
        cross: [
          {
            check: (cfg) => cfg.min <= cfg.value && cfg.value <= cfg.max,
            message: "value must be within [min, max]",
          },
        ],
      });

      // Button
      this.registerSchema("button", {
        fields: [
          { path: "type", rules: { required: true, oneOf: ["button"] } },
          { path: "id", rules: { required: true, type: "string" } },
          { path: "label", rules: { required: true, type: "string" } },
          { path: "className", rules: { type: ["string", "undefined"] } },
        ],
      });

      // Modal
      this.registerSchema("modal", {
        fields: [
          { path: "id", rules: { required: true, type: "string" } },
          { path: "closeId", rules: { required: true, type: "string" } },
          { path: "onShow", rules: { type: ["function", "undefined"] } },
          { path: "onHide", rules: { type: ["function", "undefined"] } },
        ],
      });

      // Simulation config
      this.registerSchema("simulation", {
        fields: [
          { path: "name", rules: { required: true, type: "string" } },
          { path: "controls", rules: { required: true, type: "object" } },
          { path: "modal", rules: { required: true, type: "object" } },
        ],
      });
    }

    validate(type, config, context = null) {
      const schema = this.schemas.get(type);
      const errors = [];
      if (!schema) return { valid: true, errors };

      // Field-level checks
      for (const field of schema.fields || []) {
        const value = get(config, field.path);
        const rules = field.rules || {};
        for (const [ruleName, param] of Object.entries(rules)) {
          const rule = this.customRules.get(ruleName);
          if (!rule) continue;
          const ok = rule.fn(value, param, {
            config,
            context,
            path: field.path,
          });
          if (!ok) {
            const msg =
              typeof rule.message === "function"
                ? rule.message(param)
                : rule.message;
            errors.push(`${field.path} ${msg}`);
          }
        }
      }

      // Cross-field checks
      for (const cross of schema.cross || []) {
        try {
          if (!cross.check(config, context)) {
            errors.push(cross.message || "Invalid combination");
          }
        } catch (e) {
          errors.push(cross.message || "Invalid combination");
        }
      }

      return { valid: errors.length === 0, errors };
    }

    assert(type, config, context = null) {
      const result = this.validate(type, config, context);
      if (!result.valid) {
        throw new Error(
          `Invalid ${type} config:\n- ${result.errors.join("\n- ")}`
        );
      }
      return true;
    }
  }

  return new ConfigValidatorClass();
});
