// Internationalisation module
class I18n {
    constructor() {
        this.currentLang = 'en-gb';
        this.translations = {
            'en-gb': {
                'title': 'Algorithmic Pattern Generator',
                'simulation-label': 'Simulation:',
                'conway-option': 'Conway\'s Game of Life',
                'termite-option': 'Termite Algorithm',
                'langton-option': 'Langton\'s Ant',
                'start-btn': 'Start',
                'pause-btn': 'Pause',
                'reset-btn': 'Reset',
                'immersive-btn': 'Immersive Mode',
                'generation-label': 'Generation:',
                'cell-count-label': 'Cells:',
                'fps-label': 'FPS:'
            },
            'en-us': {
                'title': 'Algorithmic Pattern Generator',
                'simulation-label': 'Simulation:',
                'conway-option': 'Conway\'s Game of Life',
                'termite-option': 'Termite Algorithm',
                'langton-option': 'Langton\'s Ant',
                'start-btn': 'Start',
                'pause-btn': 'Pause',
                'reset-btn': 'Reset',
                'immersive-btn': 'Immersive Mode',
                'generation-label': 'Generation:',
                'cell-count-label': 'Cells:',
                'fps-label': 'FPS:'
            }
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
        this.setLanguage('en-gb');
    }

    getBrowserLanguage() {
        // Get browser language preferences
        const languages = navigator.languages || [navigator.language];

        // Map browser language codes to supported app languages
        const languageMap = {
            'en': 'en-gb',
            'en-US': 'en-us',
            'en-GB': 'en-gb',
            'en-CA': 'en-gb',
            'en-AU': 'en-gb',
            'en-NZ': 'en-gb',
            'en-IE': 'en-gb',
            'en-ZA': 'en-gb',
            'en-IN': 'en-gb',
            'es': 'en-gb', // Spanish - fallback to English for now
            'fr': 'en-gb', // French - fallback to English for now
            'de': 'en-gb', // German - fallback to English for now
            'it': 'en-gb', // Italian - fallback to English for now
            'pt': 'en-gb', // Portuguese - fallback to English for now
            'ru': 'en-gb', // Russian - fallback to English for now
            'ja': 'en-gb', // Japanese - fallback to English for now
            'ko': 'en-gb', // Korean - fallback to English for now
            'zh': 'en-gb', // Chinese - fallback to English for now
            'zh-CN': 'en-gb', // Simplified Chinese - fallback to English for now
            'zh-TW': 'en-gb', // Traditional Chinese - fallback to English for now
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
            const langPrefix = lang.split('-')[0];
            if (langPrefix === 'en') {
                return 'en-gb'; // Default to British English for English variants
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

    updateElements() {
        const elements = document.querySelectorAll('[id]');
        elements.forEach(element => {
            const key = element.id;
            if (this.translations[this.currentLang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = this.translations[this.currentLang][key];
                } else {
                    element.textContent = this.translations[this.currentLang][key];
                }
            }
        });
    }

    t(key) {
        return this.translations[this.currentLang][key] || key;
    }


}

// Create global i18n instance
const i18n = new I18n();
