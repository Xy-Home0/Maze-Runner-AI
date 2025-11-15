// UI event handlers and initialization

let currentAlgorithm = 'bfs';
let isSearching = false;
let isAnimating = false;
let animationSpeed = 100;
let animationInterval = null;
let searchGenerator = null;

// Initialize the application
function init() {
    initMaze();
    
    // Set up event listeners
    document.getElementById('bfs-btn').addEventListener('click', () => selectAlgorithm('bfs'));
    document.getElementById('dfs-btn').addEventListener('click', () => selectAlgorithm('dfs'));
    document.getElementById('greedy-btn').addEventListener('click', () => selectAlgorithm('greedy'));
    document.getElementById('astar-btn').addEventListener('click', () => selectAlgorithm('astar'));
    
    document.getElementById('generate-btn').addEventListener('click', generateNewMaze);
    document.getElementById('start-btn').addEventListener('click', startSearch);
    document.getElementById('reset-btn').addEventListener('click', resetSearch);
    document.getElementById('step-btn').addEventListener('click', toggleAnimation);
    document.getElementById('compare-btn').addEventListener('click', () => comparisonModal.open());
    
    // Add speed control
    const speedControl = document.createElement('div');
    speedControl.innerHTML = `
        <div style="margin-top: 10px;">
            <label for="speed-slider">Animation Speed:</label>
            <input type="range" id="speed-slider" min="10" max="500" value="100" style="width: 100%;">
            <span id="speed-value">100ms</span>
        </div>
    `;
    document.querySelector('.maze-controls').appendChild(speedControl);
    
    document.getElementById('speed-slider').addEventListener('input', function() {
        animationSpeed = 510 - this.value;
        document.getElementById('speed-value').textContent = animationSpeed + 'ms';
        if (isAnimating) {
            stopAnimation();
            startAnimation();
        }
    });
}

// Select an algorithm
function selectAlgorithm(algorithm) {
    currentAlgorithm = algorithm;
    
    // Update button states
    document.querySelectorAll('.algorithm-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${algorithm}-btn`).classList.add('active');
    
    // Update algorithm description
    updateAlgorithmDescription(algorithm);
}

// Update algorithm description
function updateAlgorithmDescription(algorithm) {
    const descriptionElement = document.getElementById('algorithm-description');
    
    const descriptions = {
        'bfs': '<p><strong>Breadth-First Search (BFS)</strong>: Explores all nodes at the current depth before moving deeper. Complete and optimal for uniform cost problems, but memory-intensive.</p>',
        'dfs': '<p><strong>Depth-First Search (DFS)</strong>: Explores as far as possible along each branch before backtracking. Memory-efficient but may get stuck in deep or infinite paths and is not guaranteed to be optimal.</p>',
        'greedy': '<p><strong>Greedy Best-First Search</strong>: Selects the node that appears closest to the goal based on the heuristic. Fast but not guaranteed to be optimal or complete.</p>',
        'astar': '<p><strong>A* Search</strong>: Combines path cost and heuristic estimate (f(n) = g(n) + h(n)). Complete and optimal if the heuristic is admissible and consistent.</p>'
    };
    
    descriptionElement.innerHTML = descriptions[algorithm];
}

// Generate a new maze
function generateNewMaze() {
    if (isSearching) return;
    
    stopAnimation();
    generateMaze();
    drawMaze();
    updateMetrics(0, 0, 0, getAlgorithmName(currentAlgorithm));
}

// Start the search
function startSearch() {
    if (isSearching) return;
    
    isSearching = true;
    
    // Disable controls during search
    document.querySelectorAll('.maze-controls button').forEach(btn => {
        if (btn.id !== 'reset-btn') btn.disabled = true;
    });
    
    // Run the selected algorithm
    let result;
    switch (currentAlgorithm) {
        case 'bfs':
            result = bfs();
            break;
        case 'dfs':
            result = dfs();
            break;
        case 'greedy':
            result = greedyBestFirst();
            break;
        case 'astar':
            result = aStar();
            break;
    }
    
    // Re-enable controls after search
    setTimeout(() => {
        document.querySelectorAll('.maze-controls button').forEach(btn => {
            btn.disabled = false;
        });
        isSearching = false;
    }, 100);
}

// Reset the search
function resetSearch() {
    if (isSearching && !isAnimating) return;
    
    stopAnimation();
    resetMaze();
    updateMetrics(0, 0, 0, getAlgorithmName(currentAlgorithm));
}

// Toggle animation (start/stop)
function toggleAnimation() {
    if (isAnimating) {
        stopAnimation();
    } else {
        startAnimation();
    }
}

// Start the animation
function startAnimation() {
    if (isSearching) return;
    
    isAnimating = true;
    isSearching = true;
    
    // Disable other controls during animation
    document.querySelectorAll('.maze-controls button').forEach(btn => {
        if (btn.id !== 'step-btn' && btn.id !== 'reset-btn') btn.disabled = true;
    });
    
    // Update button text
    document.getElementById('step-btn').textContent = 'Stop Animation';
    document.getElementById('step-btn').style.backgroundColor = '#e74c3c';
    
    // Initialize the step-through based on selected algorithm
    switch (currentAlgorithm) {
        case 'bfs':
            searchGenerator = bfsStepByStep();
            break;
        case 'dfs':
            searchGenerator = dfsStepByStep();
            break;
        case 'greedy':
            searchGenerator = greedyStepByStep();
            break;
        case 'astar':
            searchGenerator = aStarStepByStep();
            break;
    }
    
    // Start the animation loop
    animationInterval = setInterval(executeAnimationStep, animationSpeed);
}

// Stop the animation
function stopAnimation() {
    isAnimating = false;
    isSearching = false;
    
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    
    searchGenerator = null;
    
    // Re-enable controls
    document.querySelectorAll('.maze-controls button').forEach(btn => {
        btn.disabled = false;
    });
    
    // Reset button text and color
    document.getElementById('step-btn').textContent = 'Start Animation';
    document.getElementById('step-btn').style.backgroundColor = '#2ecc71';
}

// Execute one animation step
function executeAnimationStep() {
    if (searchGenerator) {
        const result = searchGenerator.next();
        
        // Always update visualization after each step
        drawMaze();
        
        if (result.done) {
            // Search completed
            stopAnimation();
            if (result.value) {
                // Path found
                finalPath = result.value;
                drawMaze();
            } else {
                alert('No path found!');
            }
        }
    } else {
        stopAnimation();
    }
}

// Get algorithm name for display
function getAlgorithmName(algorithm) {
    const names = {
        'bfs': 'BFS',
        'dfs': 'DFS',
        'greedy': 'Greedy Best-First',
        'astar': 'A*'
    };
    
    return names[algorithm];
}

// Initialize the application when the page loads
window.addEventListener('load', init);