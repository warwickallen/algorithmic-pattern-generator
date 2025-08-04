# Fade First Cycle Fix

## Problem
The user reported that on the first cycle after deactivation, the brightness was still at 100%. This was particularly noticeable in Conway's Game of Life when cells toggle between being activated and deactivated on each cycle. The user wanted to see some fading evident immediately upon deactivation, such as toggling between 100% brightness and 80% brightness for toggling cells.

## Root Cause
In the `updateFadeStates` method, when a cell became inactive for the first time, it was setting `fadeCount: 0`. This meant that on the first cycle after deactivation, the fade factor calculation `1 - (fadeCount / this.fadeOutCycles)` became `1 - (0 / 5) = 1`, which gave 100% brightness.

## Solution
Changed the initial `fadeCount` from `0` to `1` when a cell first becomes inactive. This ensures that the first cycle after deactivation shows some fading immediately.

### Code Changes
In `simulations.js`, `BaseSimulation.updateFadeStates()`:

```javascript
// Before:
if (!fadeData) {
    // First time seeing this inactive cell - start fade
    this.cellFadeStates.set(cellKey, {
        fadeCount: 0,  // This caused 100% brightness on first cycle
        lastUpdateGeneration: currentGeneration
    });
}

// After:
if (!fadeData) {
    // First time seeing this inactive cell - start fade
    // Start with fadeCount: 1 so the first cycle shows some fading
    this.cellFadeStates.set(cellKey, {
        fadeCount: 1,  // This ensures immediate fading on first cycle
        lastUpdateGeneration: currentGeneration
    });
}
```

## Expected Behavior
With 5 fade cycles, the progression should now be:
- **t(0)**: 100% brightness (cell is active)
- **t(1)**: 80% brightness (first cycle after deactivation)
- **t(2)**: 60% brightness
- **t(3)**: 40% brightness
- **t(4)**: 20% brightness
- **t(5)**: 0% brightness (fully black)

For cells that toggle between active and inactive states (common in Conway's Game of Life), they will now toggle between:
- **Active**: 100% brightness
- **Inactive**: 80% brightness (immediately visible fading)

## Testing
Use `test-fade-first-cycle-fix.html` to verify the fix:

1. Start a simulation with 5 fade cycles
2. Toggle cell [1,1] to see immediate fade effect
3. Watch the brightness progression in the log
4. Expected: First cycle after deactivation should show 80% brightness (not 100%)

## Impact
This change affects all simulations (Conway's Game of Life, Termite Algorithm, Langton's Ant) and ensures consistent fade behavior across the application. The fix is minimal and follows the DRY principle by modifying only the base class logic. 