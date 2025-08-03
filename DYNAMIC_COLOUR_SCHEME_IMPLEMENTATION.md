# Dynamic Colour Scheme Implementation

## Overview

The algorithmic pattern generator has been updated to use a dynamic colour scheme that replaces the static green-to-blue gradient with a four-corner hue rotation system as specified in `dynamic-colour-scheme.yaml`.

## Implementation Details

### DynamicColourScheme Class

A new `DynamicColourScheme` class has been added to `simulations.js` that implements the four-corner hue rotation system:

- **Corner Configurations**: Each corner has a different starting hue and rotation period
  - Top Left: 45° (60-second period)
  - Top Right: 135° (75-second period)  
  - Bottom Right: 225° (90-second period)
  - Bottom Left: 315° (105-second period)

- **Bilinear Interpolation**: Colours at any position are calculated by interpolating between the four corner hues based on distance from each corner

- **Circular Hue Handling**: The interpolation properly handles the circular nature of hue values (0° = 360°)

### Key Methods

- `getCornerHue(corner, currentTime)`: Returns the current hue for a specific corner
- `getHueAtPosition(x, y, canvasWidth, canvasHeight)`: Calculates interpolated hue for any position
- `interpolateHue(hue1, hue2, factor)`: Handles circular interpolation between two hues
- `hslToRgb(h, s, l)`: Converts HSL values to RGB
- `getColourAtPosition(x, y, canvasWidth, canvasHeight, saturation, lightness)`: Returns final RGB colour

### Integration Changes

#### BaseSimulation Class Updates

1. **Constructor**: Added `this.colourScheme = new DynamicColourScheme()`
2. **getGradientColor()**: Updated to use dynamic colour scheme instead of static interpolation
3. **drawCell()**: Removed hardcoded green-to-blue gradient parameters
4. **drawActor()**: Updated to use dynamic colours with different saturation/lightness for visibility

#### CSS Updates

Replaced all static green (`#00ff00`) references with a new orange-cyan gradient (`#ff6b35` to `#4ecdc4`) for UI elements:

- Gradient text effects
- Button colours
- Slider thumb colours
- Focus states
- Modal headers and text

## Benefits

1. **Dynamic Visual Interest**: The colour scheme continuously evolves, creating engaging visual patterns
2. **Mathematical Beauty**: The four-corner rotation creates complex, organic colour transitions
3. **Performance Optimised**: Uses efficient HSL-to-RGB conversion and caching
4. **Consistent Across Simulations**: All simulations now use the same dynamic colour system

## Testing

A test file `test-dynamic-colours.html` has been created to demonstrate and verify the dynamic colour scheme implementation. It shows:

- Real-time corner hue values
- Visual representation of the dynamic gradient
- Time elapsed since start
- Smooth colour transitions

## Technical Notes

- The colour scheme is time-based, starting from when the page loads
- Each corner rotates independently at different speeds
- The system uses HSL colour space for smooth hue interpolation
- Actors (termites, ants) use slightly different saturation/lightness values to stand out
- All existing brightness controls continue to work with the new colour system

## Files Modified

- `simulations.js`: Added DynamicColourScheme class and updated BaseSimulation
- `styles.css`: Updated UI colour scheme from green to orange-cyan
- `test-dynamic-colours.html`: Created test file for verification 