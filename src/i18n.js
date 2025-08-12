// Internationalisation module
class I18n {
  constructor() {
    this.currentLang = "en-gb";
    this.translations = {
      "en-gb": {
        title: "Algorithmic Pattern Generator",
        "simulation-label": "Simulation:",
        "conway-option": "Conway's Game of Life",
        "termite-option": "Termite Algorithm",
        "langton-option": "Langton's Ant",
        "start-btn": "Start",
        "pause-btn": "Pause",
        "reset-btn": "Reset",
        "immersive-btn": "Immersive Mode",
        "learn-btn": "Learn",
        "generation-label": "Generation:",
        "cell-count-label": "Cells:",
        "fps-label": "FPS:",
        // Attribute keys (example): use with data-i18n-attr
        "tooltip-learn": "Open information panel",
        "aria-start": "Start or pause the simulation",
      },
      "en-us": {
        title: "Algorithmic Pattern Generator",
        "simulation-label": "Simulation:",
        "conway-option": "Conway's Game of Life",
        "termite-option": "Termite Algorithm",
        "langton-option": "Langton's Ant",
        "start-btn": "Start",
        "pause-btn": "Pause",
        "reset-btn": "Reset",
        "immersive-btn": "Immersive Mode",
        "learn-btn": "Learn",
        "generation-label": "Generation:",
        "cell-count-label": "Cells:",
        "fps-label": "FPS:",
        "tooltip-learn": "Open information panel",
        "aria-start": "Start or pause the simulation",
      },
    };

    this.init();
  }

  init() {
    // Auto-detect browser language
    this.detectAndSetLanguage();
  }

  /**
   * Auto-detect and set language based on browser preferences
   * Priority: 1. Browser language, 2. Default (en-gb)
   */
  detectAndSetLanguage() {
    // Detect browser language
    const browserLang = this.getBrowserLanguage();
    if (browserLang && this.translations[browserLang]) {
      this.setLanguage(browserLang);
      return;
    }

    // Fall back to default language
    this.setLanguage("en-gb");
  }

  getBrowserLanguage() {
    // Get browser language preferences
    const languages = navigator.languages || [navigator.language];

    // Map browser language codes to supported app languages
    const languageMap = {
      en: "en-gb",
      "en-US": "en-us",
      "en-GB": "en-gb",
      "en-CA": "en-gb",
      "en-AU": "en-gb",
      "en-NZ": "en-gb",
      "en-IE": "en-gb",
      "en-ZA": "en-gb",
      "en-IN": "en-gb",
      es: "en-gb", // Spanish - fallback to English for now
      fr: "en-gb", // French - fallback to English for now
      de: "en-gb", // German - fallback to English for now
      it: "en-gb", // Italian - fallback to English for now
      pt: "en-gb", // Portuguese - fallback to English for now
      ru: "en-gb", // Russian - fallback to English for now
      ja: "en-gb", // Japanese - fallback to English for now
      ko: "en-gb", // Korean - fallback to English for now
      zh: "en-gb", // Chinese - fallback to English for now
      "zh-CN": "en-gb", // Simplified Chinese - fallback to English for now
      "zh-TW": "en-gb", // Traditional Chinese - fallback to English for now
    };

    // Try to find a match
    for (const lang of languages) {
      const mappedLang = languageMap[lang];
      if (mappedLang && this.translations[mappedLang]) {
        return mappedLang;
      }
    }

    // If no exact match, try to match language code prefix
    for (const lang of languages) {
      const langPrefix = lang.split("-")[0];
      if (langPrefix === "en") {
        return "en-gb"; // Default to British English for English variants
      }
    }

    return null;
  }

  setLanguage(lang) {
    if (!this.translations[lang]) return;

    this.currentLang = lang;

    // Update all translatable elements
    this.updateElements();
  }

  // Enhanced element updater supporting:
  // - Legacy id-based translation
  // - data-i18n-key for text/placeholder
  // - data-i18n-attr="attrName:key,aria-label:key2,..." for attributes
  updateElements() {
    if (typeof document === "undefined") return;

    // Legacy: translate by id
    const legacy = document.querySelectorAll("[id]");
    legacy.forEach((element) => {
      const key = element.id;
      const val = this.t(key);
      if (val && val !== key) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = val;
        } else {
          element.textContent = val;
        }
      }
    });

    // New: translate elements with data-i18n-key
    const keyNodes = document.querySelectorAll("[data-i18n-key]");
    keyNodes.forEach((el) => {
      const key = el.getAttribute("data-i18n-key");
      if (!key) return;
      const val = this.t(key);
      if (!val) return;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.setAttribute("placeholder", val);
      } else {
        el.textContent = val;
      }
    });

    // New: translate attributes via data-i18n-attr
    const attrNodes = document.querySelectorAll("[data-i18n-attr]");
    attrNodes.forEach((el) => {
      const spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;
      // Format: "title:tooltip-learn,aria-label:aria-start"
      spec.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => (s || "").trim());
        if (!attr || !key) return;
        const val = this.t(key);
        if (!val) return;
        el.setAttribute(attr, val);
      });
    });
  }

  t(key) {
    return this.translations[this.currentLang][key] || key;
  }

  // Allow runtime extension of translations
  setTranslations(lang, map) {
    if (!lang || !map || typeof map !== "object") return;
    this.translations[lang] = { ...(this.translations[lang] || {}), ...map };
    if (lang === this.currentLang) this.updateElements();
  }

  // Translate a specific element on demand
  translateElement(element) {
    if (!element || typeof element.getAttribute !== "function") return;
    const key = element.getAttribute("data-i18n-key");
    if (key) {
      const val = this.t(key);
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.setAttribute("placeholder", val);
      } else {
        element.textContent = val;
      }
    }
    const spec = element.getAttribute("data-i18n-attr");
    if (spec) {
      spec.split(",").forEach((pair) => {
        const [attr, aKey] = pair.split(":").map((s) => (s || "").trim());
        if (!attr || !aKey) return;
        const val = this.t(aKey);
        element.setAttribute(attr, val);
      });
    }
  }
}

// Create global i18n instance
const i18n = new I18n();
