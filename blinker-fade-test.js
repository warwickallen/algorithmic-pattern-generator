// Browser-compatible test for fade behavior
// This should be run in the browser context where the simulation classes are available

function testBlinkerFade() {
    console.log('Testing blinker fade behavior...');

    // Create a mock canvas and context
    const canvas = {
        width: 300,
        height: 300,
        getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    const ctx = {
        fillStyle: '',
        fillRect: () => {},
        clearRect: () => {},
        setGlowEffect: () => {},
        clearGlowEffect: () => {}
    };

    // Create simulation (assuming ConwayGameOfLife is available globally)
    const simulation = new ConwayGameOfLife(canvas, ctx);
    simulation.init();
    simulation.setFadeOutCycles(5);

    // Set up a 3x3 blinker pattern
    simulation.grids.current[0][1] = true;
    simulation.grids.current[1][1] = true;
    simulation.grids.current[2][1] = true;

    console.log('Initial grid:');
    for (let row = 0; row < 3; row++) {
        let rowStr = '';
        for (let col = 0; col < 3; col++) {
            rowStr += simulation.grids.current[row][col] ? '1 ' : '0 ';
        }
        console.log(rowStr);
    }

    // Run for 10 generations and log fade states
    for (let gen = 0; gen < 10; gen++) {
        console.log(`\n=== Generation ${gen} ===`);

        // Log current grid
        console.log('Grid state:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                rowStr += simulation.grids.current[row][col] ? '1 ' : '0 ';
            }
            console.log(rowStr);
        }

        // Log fade states before update
        console.log('Fade states before update:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                const cellKey = `${row},${col}`;
                const fadeData = simulation.cellFadeStates.get(cellKey);
                if (fadeData) {
                    rowStr += `{f:${fadeData.fadeCount},g:${fadeData.lastUpdateGeneration},a:${fadeData.isActive}} `;
                } else {
                    rowStr += 'null ';
                }
            }
            console.log(rowStr);
        }

        // Log fade factors
        console.log('Fade factors:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                const fadeFactor = simulation.getCellFadeFactor(row, col, simulation.grids.current[row][col]);
                rowStr += fadeFactor.toFixed(1) + ' ';
            }
            console.log(rowStr);
        }

        // Update to next generation
        simulation.update();

        // Log fade states after update
        console.log('Fade states after update:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                const cellKey = `${row},${col}`;
                const fadeData = simulation.cellFadeStates.get(cellKey);
                if (fadeData) {
                    rowStr += `{f:${fadeData.fadeCount},g:${fadeData.lastUpdateGeneration},a:${fadeData.isActive}} `;
                } else {
                    rowStr += 'null ';
                }
            }
            console.log(rowStr);
        }
    }
}

// Test function to check for race conditions
function testRaceCondition() {
    console.log('Testing for race conditions...');

    const canvas = {
        width: 300,
        height: 300,
        getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    const ctx = {
        fillStyle: '',
        fillRect: () => {},
        clearRect: () => {},
        setGlowEffect: () => {},
        clearGlowEffect: () => {}
    };

    const simulation = new ConwayGameOfLife(canvas, ctx);
    simulation.init();
    simulation.setFadeOutCycles(5);

    // Set up a simple pattern
    simulation.grids.current[1][1] = true;

    console.log('Initial state:');
    console.log('Grid:', simulation.grids.current[1][1]);
    console.log('Generation:', simulation.generation);

    // Simulate what happens during toggleCell
    console.log('\nSimulating toggleCell behavior...');
    simulation.updateFadeStates(simulation.grids.current);
    console.log('After updateFadeStates in toggleCell');

    // Now simulate normal update
    console.log('\nSimulating normal update...');
    simulation.update();
    console.log('After normal update');

    // Check if there are any inconsistencies
    console.log('\nFinal fade states:');
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cellKey = `${row},${col}`;
            const fadeData = simulation.cellFadeStates.get(cellKey);
            if (fadeData) {
                console.log(`Cell ${row},${col}:`, fadeData);
            }
        }
    }
}

// New function to test the specific timing issue
function testTimingIssue() {
    console.log('Testing timing issue in updateFadeStates...');

    const canvas = {
        width: 300,
        height: 300,
        getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    const ctx = {
        fillStyle: '',
        fillRect: () => {},
        clearRect: () => {},
        setGlowEffect: () => {},
        clearGlowEffect: () => {}
    };

    const simulation = new ConwayGameOfLife(canvas, ctx);
    simulation.init();
    simulation.setFadeOutCycles(5);

    // Set up a blinker pattern
    simulation.grids.current[0][1] = true;
    simulation.grids.current[1][1] = true;
    simulation.grids.current[2][1] = true;

    console.log('Initial generation:', simulation.generation);
    console.log('Initial fade states:');
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cellKey = `${row},${col}`;
            const fadeData = simulation.cellFadeStates.get(cellKey);
            if (fadeData) {
                console.log(`Cell ${row},${col}:`, fadeData);
            }
        }
    }

    // Run one update cycle and examine the timing
    console.log('\n=== Before update ===');
    console.log('Generation:', simulation.generation);
    console.log('Grid state:');
    for (let row = 0; row < 3; row++) {
        let rowStr = '';
        for (let col = 0; col < 3; col++) {
            rowStr += simulation.grids.current[row][col] ? '1 ' : '0 ';
        }
        console.log(rowStr);
    }

    // Call updateFadeStates manually to see what happens
    console.log('\n=== Calling updateFadeStates ===');
    simulation.updateFadeStates(simulation.grids.current);
    
    console.log('After updateFadeStates:');
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cellKey = `${row},${col}`;
            const fadeData = simulation.cellFadeStates.get(cellKey);
            if (fadeData) {
                console.log(`Cell ${row},${col}:`, fadeData);
            }
        }
    }

    // Now increment generation and see what happens
    console.log('\n=== After generation increment ===');
    simulation.generation++;
    
    // Call updateFadeStates again
    simulation.updateFadeStates(simulation.grids.current);
    
    console.log('After second updateFadeStates:');
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cellKey = `${row},${col}`;
            const fadeData = simulation.cellFadeStates.get(cellKey);
            if (fadeData) {
                console.log(`Cell ${row},${col}:`, fadeData);
            }
        }
    }
}

// Function to enable debug mode and test the fix
function testFixedBlinker() {
    console.log('Testing fixed blinker with debug mode...');
    
    // Enable debug mode
    window.DEBUG_FADE = true;
    
    const canvas = {
        width: 300,
        height: 300,
        getBoundingClientRect: () => ({ left: 0, top: 0 })
    };

    const ctx = {
        fillStyle: '',
        fillRect: () => {},
        clearRect: () => {},
        setGlowEffect: () => {},
        clearGlowEffect: () => {}
    };

    const simulation = new ConwayGameOfLife(canvas, ctx);
    simulation.init();
    simulation.setFadeOutCycles(5);

    // Set up a 3x3 blinker pattern
    simulation.grids.current[0][1] = true;
    simulation.grids.current[1][1] = true;
    simulation.grids.current[2][1] = true;

    console.log('Initial grid:');
    for (let row = 0; row < 3; row++) {
        let rowStr = '';
        for (let col = 0; col < 3; col++) {
            rowStr += simulation.grids.current[row][col] ? '1 ' : '0 ';
        }
        console.log(rowStr);
    }

    // Run for 6 generations and log fade states
    for (let gen = 0; gen < 6; gen++) {
        console.log(`\n=== Generation ${gen} ===`);

        // Log current grid
        console.log('Grid state:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                rowStr += simulation.grids.current[row][col] ? '1 ' : '0 ';
            }
            console.log(rowStr);
        }

        // Log fade states before update
        console.log('Fade states before update:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                const cellKey = `${row},${col}`;
                const fadeData = simulation.cellFadeStates.get(cellKey);
                if (fadeData) {
                    rowStr += `{f:${fadeData.fadeCount},g:${fadeData.lastUpdateGeneration},a:${fadeData.isActive}} `;
                } else {
                    rowStr += 'null ';
                }
            }
            console.log(rowStr);
        }

        // Log fade factors
        console.log('Fade factors:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                const fadeFactor = simulation.getCellFadeFactor(row, col, simulation.grids.current[row][col]);
                rowStr += fadeFactor.toFixed(1) + ' ';
            }
            console.log(rowStr);
        }

        // Update to next generation
        simulation.update();

        // Log fade states after update
        console.log('Fade states after update:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                const cellKey = `${row},${col}`;
                const fadeData = simulation.cellFadeStates.get(cellKey);
                if (fadeData) {
                    rowStr += `{f:${fadeData.fadeCount},g:${fadeData.lastUpdateGeneration},a:${fadeData.isActive}} `;
                } else {
                    rowStr += 'null ';
                }
            }
            console.log(rowStr);
        }
    }
    
    // Disable debug mode
    window.DEBUG_FADE = false;
}

// Test the re-engineered fading mechanism
function testReengineeredFading() {
    console.log('Testing re-engineered fading mechanism...');
    const canvas = { width: 300, height: 300, getBoundingClientRect: () => ({ left: 0, top: 0 }) };
    const ctx = { fillStyle: '', fillRect: () => {}, clearRect: () => {}, setGlowEffect: () => {}, clearGlowEffect: () => {} };
    const simulation = new ConwayGameOfLife(canvas, ctx);
    simulation.init();
    simulation.setFadeOutCycles(5);
    simulation.setFadeDecrement(0.2); // Set fade decrement to 0.2
    
    // Set up blinker pattern
    simulation.grids.current[0][1] = true;
    simulation.grids.current[1][1] = true;
    simulation.grids.current[2][1] = true;
    
    console.log('Initial grid:');
    for (let row = 0; row < 3; row++) {
        let rowStr = '';
        for (let col = 0; col < 3; col++) { rowStr += simulation.grids.current[row][col] ? '1 ' : '0 '; }
        console.log(rowStr);
    }
    
    for (let gen = 0; gen < 6; gen++) {
        console.log(`\n=== Generation ${gen} ===`);
        console.log('Grid state:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) { rowStr += simulation.grids.current[row][col] ? '1 ' : '0 '; }
            console.log(rowStr);
        }
        
        console.log('Cell brightness values:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                const brightness = simulation.getCellBrightness(row, col);
                rowStr += brightness.toFixed(1) + ' ';
            }
            console.log(rowStr);
        }
        
        simulation.update();
        
        console.log('Brightness values after update:');
        for (let row = 0; row < 3; row++) {
            let rowStr = '';
            for (let col = 0; col < 3; col++) {
                const brightness = simulation.getCellBrightness(row, col);
                rowStr += brightness.toFixed(1) + ' ';
            }
            console.log(rowStr);
        }
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.testBlinkerFade = testBlinkerFade;
    window.testRaceCondition = testRaceCondition;
    window.testTimingIssue = testTimingIssue;
    window.testFixedBlinker = testFixedBlinker;
    window.testReengineeredFading = testReengineeredFading;
} 