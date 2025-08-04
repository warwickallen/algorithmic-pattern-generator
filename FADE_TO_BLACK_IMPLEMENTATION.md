# Fade-to-Black Implementation

## Overview

This implementation adds a fade-to-black effect for deactivated cells across all simulations. When a cell is deactivated, it gradually fades to black over a configurable number of cycles, rather than changing instantly. When a cell is activated, it immediately shows at full brightness.

## Key Features

- **Configurable Fade Duration**: The number of cycles to fade to black is easily configurable (default: 5 cycles)
- **Instant Activation**: Cells show full brightness immediately when activated
- **Consistent Across Simulations**: Works with Conway's Game of Life, Termite Algorithm, and Langton's Ant
- **DRY Implementation**: Uses shared base class functionality to avoid code duplication
- **Performance Optimized**: Efficient fade state tracking with minimal memory overhead

## Implementation Details

### BaseSimulation Class Additions

The following properties and methods were added to the `BaseSimulation` class:

#### Properties
- `fadeOutCycles`: Number of cycles to fade to black (default: 5)
- `cellFadeStates`: Map tracking fade state for each cell

#### Methods
- `setFadeOutCycles(cycles)`: Configure fade duration (1-20 cycles)
- `getFadeOutCycles()`: Get current fade duration
- `updateFadeStates(grid)`: Update fade states based on current grid
- `getCellFadeFactor(row, col)`: Get fade factor for specific cell (0-1)
- `clearFadeStates()`: Clear all fade states

### Cell Rendering Changes

The `drawCell()` method was modified to:
1. Apply brightness to the cell colour
2. Get the fade factor for the cell's position
3. Interpolate between the cell colour and black based on fade factor
4. Apply fade factor to glow effect intensity

### Grid Rendering Changes

The `drawGrid()` method was modified to:
1. Call `updateFadeStates()` before rendering cells
2. This ensures fade states are updated based on current grid state

### Simulation-Specific Handling

#### Conway's Game of Life
- Uses standard grid structure
- Automatically gets fade effect through `drawGrid()` method

#### Termite Algorithm
- Uses wood chip positions instead of grid
- Creates virtual grid for fade state tracking
- Updates fade states based on virtual grid before rendering

#### Langton's Ant
- Uses standard grid structure
- Automatically gets fade effect through `drawGrid()` method

## Usage

### Basic Configuration

```javascript
// Set fade duration to 10 cycles
simulation.setFadeOutCycles(10);

// Get current fade duration
const cycles = simulation.getFadeOutCycles();
```

### Example: Changing Fade Duration

```javascript
// Create simulation
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const simulation = new ConwayGameOfLife(canvas, ctx);

// Initialize
simulation.init();

// Configure fade duration
simulation.setFadeOutCycles(8); // 8 cycles to fade to black

// Start simulation
simulation.start();
```

### Example: Testing Fade Effect

```javascript
// Clear simulation
simulation.clear();

// Activate a cell
simulation.toggleCell(50, 50);

// Deactivate the cell
simulation.toggleCell(50, 50);

// The cell will now fade to black over the configured number of cycles
// Each call to simulation.draw() advances the fade by one cycle
```

## Configuration Limits

- **Minimum fade cycles**: 1 (instant fade)
- **Maximum fade cycles**: 20 (very gradual fade)
- **Default fade cycles**: 5

## Performance Considerations

- Fade states are stored in a Map for efficient lookup
- Only cells that have been deactivated have fade state entries
- Active cells have no fade state entry (optimized for memory)
- Fade state clearing is automatic during reset/clear operations

## Testing

A comprehensive test file (`test-fade-to-black.html`) is provided that:
- Tests fade cycle configurability
- Verifies cell fading when deactivated
- Confirms instant activation of cells
- Checks consistency across all simulations
- Provides interactive controls for testing

## Integration with Existing Features

The fade-to-black effect integrates seamlessly with existing features:
- **Brightness Control**: Fade effect works with brightness adjustments
- **Dynamic Colour Scheme**: Fade effect applies to dynamic colours
- **Performance Optimization**: Minimal impact on rendering performance
- **State Management**: Fade states are properly managed during state operations

## Future Enhancements

Potential improvements could include:
- Per-simulation fade duration configuration
- Different fade curves (linear, exponential, etc.)
- Fade-to-colour instead of fade-to-black
- Fade effect for actors (termites, ants)
- Visual indicators for fade progress 