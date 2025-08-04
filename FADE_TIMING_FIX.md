# Fade Timing Fix

## Problem Description

The fade-to-black effect was not following the correct linear progression. Users reported seeing this incorrect pattern:

- t(0): 100% brightness
- t(1): 20% brightness  
- t(2): 40% brightness
- t(3): 60% brightness
- t(4): 80% brightness
- t(5): 0% brightness

The expected correct pattern should be:

- t(0): 100% brightness
- t(1): 80% brightness
- t(2): 60% brightness
- t(3): 40% brightness
- t(4): 20% brightness
- t(5): 0% brightness

Additionally, users reported that "when the page is first loaded, all the cells are lit."

## Root Cause

The issue was that `updateFadeStates()` was being called from `drawGrid()`, which is called on every animation frame (typically 60 FPS), rather than only when the simulation actually updates. This caused the fade states to be updated multiple times per generation, leading to incorrect fade progression.

**Animation Loop Structure:**
1. `animate()` is called on every frame (60 FPS)
2. `update()` is only called when `currentTime - this.lastUpdateTime >= this.updateInterval` (based on simulation speed)
3. `draw()` is called on every frame

Since `drawGrid()` was calling `updateFadeStates()` on every frame, the fade logic was being executed much more frequently than intended, causing timing issues.

## Solution

Moved the `updateFadeStates()` call from `drawGrid()` to the `update()` method in each simulation class. This ensures that fade states are only updated when the simulation actually progresses to a new generation.

### Changes Made

1. **Removed from `BaseSimulation.drawGrid()`:**
   ```javascript
   drawGrid(grid, cellRenderer = null) {
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
       
       // ❌ REMOVED: this.updateFadeStates(grid);
       
       // Render ALL cells (both active and inactive) to show fade effects
       // ... rest of drawing code
   }
   ```

2. **Added to `ConwayGameOfLife.update()`:**
   ```javascript
   update() {
       // ... existing Conway logic ...
       
       // Update cell count
       this.cellCount = this.countLiveCells(this.grids.current);
       
       // ✅ ADDED: Update fade states after grid has been updated
       this.updateFadeStates(this.grids.current);
   }
   ```

3. **Added to `TermiteAlgorithm.update()`:**
   ```javascript
   update() {
       // ... existing termite logic ...
       
       // ✅ ADDED: Create virtual grid and update fade states
       const virtualGrid = this.createGrid(this.rows, this.cols, false);
       
       // Mark active cells in virtual grid
       this.woodChips.forEach(chipKey => {
           const [x, y] = chipKey.split(',').map(Number);
           const { col, row } = this.screenToGrid(x, y);
           if (this.isValidGridPosition(row, col)) {
               virtualGrid[row][col] = true;
           }
       });
       
       // Update fade states after simulation has been updated
       this.updateFadeStates(virtualGrid);
   }
   ```

4. **Added to `LangtonsAnt.update()`:**
   ```javascript
   update() {
       // ... existing ant logic ...
       
       // Update cell count
       this.cellCount = this.countLiveCells(this.grid);
       
       // ✅ ADDED: Update fade states after grid has been updated
       this.updateFadeStates(this.grid);
   }
   ```

5. **Removed from `TermiteAlgorithm.draw()`:**
   ```javascript
   draw() {
       // ... existing drawing code ...
       
       // Create virtual grid for fade state tracking
       const virtualGrid = this.createGrid(this.rows, this.cols, false);
       
       // Mark active cells in virtual grid
       this.woodChips.forEach(chipKey => {
           const [x, y] = chipKey.split(',').map(Number);
           const { col, row } = this.screenToGrid(x, y);
           if (this.isValidGridPosition(row, col)) {
               virtualGrid[row][col] = true;
           }
       });
       
       // ❌ REMOVED: this.updateFadeStates(virtualGrid);
       
       // Draw wood chips with fade effect
       // ... rest of drawing code
   }
   ```

## Expected Behavior

Now the fade effect follows the correct linear progression:

- t(0): fadeCount = 0 → fadeFactor = 1 - 0/5 = 1.0 (100% brightness)
- t(1): fadeCount = 1 → fadeFactor = 1 - 1/5 = 0.8 (80% brightness)
- t(2): fadeCount = 2 → fadeFactor = 1 - 2/5 = 0.6 (60% brightness)
- t(3): fadeCount = 3 → fadeFactor = 1 - 3/5 = 0.4 (40% brightness)
- t(4): fadeCount = 4 → fadeFactor = 1 - 4/5 = 0.2 (20% brightness)
- t(5): fadeCount = 5 → fadeFactor = 1 - 5/5 = 0.0 (0% brightness)

## Testing

A new test page `test-fade-timing-fix.html` has been created to verify the fix. The test:

1. Allows selection of simulation type, fade cycles, and speed
2. Provides a button to toggle cell [1,1] for testing
3. Logs the fade progression in real-time
4. Shows the expected linear fade pattern

## Files Modified

- `simulations.js`: 
  - Removed `updateFadeStates()` call from `BaseSimulation.drawGrid()`
  - Added `updateFadeStates()` calls to `ConwayGameOfLife.update()`
  - Added `updateFadeStates()` calls to `TermiteAlgorithm.update()`
  - Added `updateFadeStates()` calls to `LangtonsAnt.update()`
  - Removed `updateFadeStates()` call from `TermiteAlgorithm.draw()`
- `test-fade-timing-fix.html`: New test page for verification

## Verification

To verify the fix works correctly:

1. Open `test-fade-timing-fix.html`
2. Set fade cycles to 5 and speed to 1 step/second
3. Start the test
4. Toggle cell [1,1] to activate it
5. Wait for it to deactivate naturally or toggle it again
6. Observe the log showing the correct fade progression: 100% → 80% → 60% → 40% → 20% → 0%

The fix ensures that fade states are only updated when the simulation actually progresses, preventing the timing issues that caused the incorrect fade order. 