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
                'clear-btn': 'Clear',
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
                'clear-btn': 'Clear',
                'immersive-btn': 'Immersive Mode',
                'generation-label': 'Generation:',
                'cell-count-label': 'Cells:',
                'fps-label': 'FPS:'
            }
        };
        
        this.init();
    }
    
    init() {
        // Set up language selector event listeners
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.setLanguage(lang);
            });
        });
        
        // Load saved language preference
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && this.translations[savedLang]) {
            this.setLanguage(savedLang);
        }
    }
    
    setLanguage(lang) {
        if (!this.translations[lang]) return;
        
        this.currentLang = lang;
        localStorage.setItem('preferred-language', lang);
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
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
    
    // Method to add new languages easily
    addLanguage(langCode, translations) {
        this.translations[langCode] = translations;
        
        // Add language button if it doesn't exist
        if (!document.querySelector(`[data-lang="${langCode}"]`)) {
            const langSelector = document.getElementById('language-selector');
            const btn = document.createElement('button');
            btn.className = 'lang-btn';
            btn.dataset.lang = langCode;
            btn.textContent = this.getFlagEmoji(langCode);
            btn.addEventListener('click', () => this.setLanguage(langCode));
            langSelector.appendChild(btn);
        }
    }
    
    getFlagEmoji(langCode) {
        const flagMap = {
            'en-gb': '🇬🇧',
            'en-us': '🇺🇸',
            'es': '🇪🇸',
            'fr': '🇫🇷',
            'de': '🇩🇪',
            'it': '🇮🇹',
            'pt': '🇵🇹',
            'ru': '🇷🇺',
            'ja': '🇯🇵',
            'ko': '🇰🇷',
            'zh': '🇨🇳'
        };
        return flagMap[langCode] || '🌐';
    }
}

// Create global i18n instance
const i18n = new I18n(); 