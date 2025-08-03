# Drag Toggling Implementation

## Overview
Extended the cell toggling feature to support click-and-drag functionality, allowing users to toggle multiple cells by dragging the mouse across the grid. This functionality is implemented in the base class and applies to all three simulations (Conway's Game of Life, Termite Algorithm, and Langton's Ant).

## Implementation Details

### Base Class Extension
Added the following methods to `BaseSimulation` class in `simulations.js`:

1. **`initDragToggling()`** - Initializes drag toggling functionality
   - Sets up mouse event listeners (mousedown, mousemove, mouseup, mouseleave)
   - Initializes drag state tracking variables
   - Stores bound event handlers for proper cleanup

2. **`handleMouseDown(e)`** - Handles mouse down events
   - Converts screen coordinates to canvas coordinates
   - Sets drag state to active
   - Toggles the initial cell at click position
   - Clears previous drag tracking data

3. **`handleMouseMove(e)`** - Handles mouse move events during drag
   - Only processes if currently dragging
   - Toggles cells along the drag path using Bresenham's line algorithm
   - Updates last drag position

4. **`handleMouseUp(e)`** - Handles mouse up events
   - Resets drag state
   - Clears drag tracking data

5. **`toggleCellAtPosition(x, y)`** - Toggles a cell at specific screen coordinates
   - Converts screen coordinates to grid coordinates
   - Prevents duplicate toggling during the same drag operation
   - Triggers UI updates when cells are toggled

6. **`toggleCellsAlongPath(startX, startY, endX, endY)`** - Toggles all cells along a path
   - Uses Bresenham's line algorithm to determine all grid cells along the path
   - Calls `toggleCellAtPosition` for each cell in the path

7. **`getLinePoints(x0, y0, x1, y1)`** - Implements Bresenham's line algorithm
   - Returns all grid coordinates along a line between two points
   - Ensures smooth, continuous cell toggling during drag operations

8. **`cleanupDragToggling()`** - Cleans up event listeners
   - Removes all mouse event listeners
   - Prevents memory leaks when simulations are destroyed

### Integration with Existing Code

1. **Initialization**: The `init()` method in `BaseSimulation` now calls `initDragToggling()` to set up the drag functionality for all simulations.

2. **UI Updates**: When cells are toggled during drag operations, the implementation automatically triggers UI updates by calling `window.app.updateUI()` if available.

3. **Event Handling**: Removed the existing click handler from `app.js` since the drag functionality handles both single clicks and drags.

4. **Cleanup**: Added drag toggling cleanup to the main app cleanup method to prevent memory leaks.

## Features

### Single Click Behaviour
- **Preserved**: Single click toggling works exactly as before
- **No Changes**: Users can still click individual cells to toggle them
- **Consistent**: Same visual feedback and cell count updates

### Drag Behaviour
- **Continuous Toggling**: Drag across multiple cells to toggle them all
- **Smooth Path**: Uses Bresenham's algorithm for smooth, continuous cell toggling
- **No Duplicates**: Prevents toggling the same cell multiple times during a single drag
- **Visual Feedback**: Immediate visual updates as cells are toggled
- **UI Updates**: Automatic UI updates (cell count, generation, etc.) during drag

### Cross-Simulation Compatibility
- **Universal**: Works with all three simulations (Conway, Termite, Langton)
- **Consistent**: Same drag behaviour across all simulation types
- **Inherited**: All simulations automatically inherit this functionality through the base class

## Testing

### Test Suite Integration
Added a new test `'Drag Cell Toggle'` to the test suite that:
- Verifies drag methods exist on all simulations
- Tests that single click functionality still works
- Tests drag functionality by simulating mouse events
- Validates that cell counts change appropriately

### Manual Testing
Created `test-drag-toggling.html` for manual testing:
- Interactive canvas for testing drag functionality
- Buttons to switch between different simulations
- Real-time feedback on test results
- Visual confirmation of drag toggling behaviour

## Technical Considerations

### Performance
- **Efficient Algorithm**: Bresenham's line algorithm ensures optimal performance
- **Event Throttling**: Mouse move events are processed efficiently
- **Memory Management**: Proper cleanup prevents memory leaks

### User Experience
- **Intuitive**: Natural click-and-drag interaction
- **Responsive**: Immediate visual feedback
- **Consistent**: Same behaviour across all simulations
- **Non-Disruptive**: Doesn't interfere with existing functionality

### Code Quality
- **DRY Principle**: Implemented in base class, inherited by all simulations
- **Minimal Changes**: Preserves existing single-click functionality
- **Clean Architecture**: Proper separation of concerns
- **Maintainable**: Well-documented and testable code

## Usage

Users can now:
1. **Single Click**: Click on any cell to toggle it (existing behaviour)
2. **Drag Toggle**: Click and drag across multiple cells to toggle them all
3. **Mixed Usage**: Use both single clicks and drags as needed
4. **Cross-Simulation**: Use drag toggling in any of the three simulations

The feature enhances the interactive experience while maintaining backward compatibility with existing functionality. 