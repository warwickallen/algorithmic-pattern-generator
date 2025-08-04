# Fade Order Fix

## Problem Description

The fade-to-black effect was working, but the brightness levels were appearing in the wrong order. When a cell was deactivated, it followed this incorrect pattern:

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

## Root Cause

The issue was in the `updateFadeStates` method in `simulations.js`. When a cell became inactive for the first time, the `fadeCount` was being initialized to `1` instead of `0`.

**Before the fix:**
```javascript
// First time seeing this inactive cell - start fade
this.cellFadeStates.set(cellKey, {
    fadeCount: 1,  // ❌ Should start at 0
    lastUpdateGeneration: currentGeneration
});
```

This caused the fade factor calculation to be off by one step:
- fadeCount = 1 → fadeFactor = 1 - 1/5 = 0.8 (20% brightness)
- fadeCount = 2 → fadeFactor = 1 - 2/5 = 0.6 (40% brightness)
- etc.

## Solution

Changed the initial `fadeCount` from `1` to `0` in the `updateFadeStates` method:

**After the fix:**
```javascript
// First time seeing this inactive cell - start fade
this.cellFadeStates.set(cellKey, {
    fadeCount: 0,  // ✅ Now starts at 0
    lastUpdateGeneration: currentGeneration
});
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

A new test page `test-fade-order-fix.html` has been created to verify the fix. The test:

1. Allows selection of simulation type, fade cycles, and speed
2. Provides a button to toggle cell [1,1] for testing
3. Logs the fade progression in real-time
4. Shows the expected linear fade pattern

## Files Modified

- `simulations.js`: Fixed initial `fadeCount` value in `updateFadeStates` method
- `test-fade-order-fix.html`: New test page for verification

## Verification

To verify the fix works correctly:

1. Open `test-fade-order-fix.html`
2. Set fade cycles to 5 and speed to 1 step/second
3. Start the test
4. Toggle cell [1,1] to activate it
5. Wait for it to deactivate naturally or toggle it again
6. Observe the log showing the correct fade progression: 100% → 80% → 60% → 40% → 20% → 0% 