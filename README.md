# Algorithmic Pattern Generator

A combined web application featuring three classic algorithmic simulations: Conway's Game of Life, the Termite Algorithm, and Langton's Ant. This educational tool provides an interactive way to explore emergent behaviour and cellular automata.

## Features

### Three Simulations

1. **Conway's Game of Life** - A cellular automaton where cells live or die based on their neighbours
2. **Termite Algorithm** - Termites that pick up and drop wood chips, creating fascinating patterns
3. **Langton's Ant** - A simple ant following basic rules that creates complex highways

### Key Features

- **Simulation Selector** - Switch between the three algorithms seamlessly
- **Immersive Mode** - Hide controls for a full-screen experience
- **Internationalisation** - Support for UK English and US English (easily extensible)
- **Interactive Controls** - Click to toggle cells in Conway's Game of Life
- **Real-time Statistics** - Generation count, cell count, and FPS display
- **Keyboard Shortcuts** - Space to start/pause, Ctrl+R to reset, Ctrl+C to clear, Ctrl+I for immersive mode

## Usage

1. Open `index.html` in a modern web browser
2. Select your preferred simulation from the dropdown
3. Use the control buttons to start, pause, reset, or clear the simulation
4. Click "Immersive Mode" for a distraction-free experience
5. Use the language selector (🇬🇧/🇺🇸) to switch between British and American English

## Keyboard Shortcuts

- **Space** - Start/Pause simulation
- **Ctrl+R** - Reset simulation
- **Ctrl+C** - Clear simulation
- **Ctrl+I** - Toggle immersive mode
- **Escape** - Exit immersive mode

## Technical Details

The application is built using vanilla JavaScript with a modular architecture:

- `index.html` - Main HTML structure
- `styles.css` - Responsive styling with immersive mode support
- `i18n.js` - Internationalisation system
- `simulations.js` - Simulation algorithms (BaseSimulation, ConwayGameOfLife, TermiteAlgorithm, LangtonsAnt)
- `app.js` - Main application logic and UI management

## Adding New Languages

To add support for additional languages, use the `i18n.addLanguage()` method:

```javascript
i18n.addLanguage('es', {
    'title': 'Generador de Patrones Algorítmicos',
    'start-btn': 'Iniciar',
    // ... other translations
});
```

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript features
- HTML5 Canvas API
- CSS Grid and Flexbox
- Local Storage API

## License

This project is open source and available under the MIT License.