// Multi-Algorithm Visualization Modal
class MultiAlgorithmModal {
    constructor() {
        this.isRunning = false;
        this.generators = {};
        this.animationInterval = null;
        this.speeds = {
            bfs: 100,
            dfs: 100,
            greedy: 100,
            astar: 100
        };
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        const modalHTML = `
        <div id="multi-algorithm-modal" class="modal">
            <div class="modal-content" style="max-width: 1200px;">
                <div class="modal-header">
                    <h2>All Algorithms Visualization</h2>
                    <div class="modal-header-controls">
                    <button class="fullscreen-button" title="Toggle Fullscreen">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M3 3v4h1V4h3V3H3zm0 9h4v-1H4v-3H3v4zm9 0v-3h-1v3h-3v1h4zm0-9h-3v1h3v3h1V3z"/>
                        </svg>
                    </button>
                    <span class="close-button">&times;</span>
                </div>
                </div>
                <div class="modal-body">
                    <div class="multi-algorithm-controls">
                        <div class="speed-controls">
                            <h3>Algorithm Speeds</h3>
                            <div class="speed-control-group">
                                <label>BFS Speed:</label>
                                <input type="range" class="speed-slider" data-algo="bfs" min="10" max="500" value="100">
                                <span class="speed-value" data-algo="bfs">100ms</span>
                            </div>
                            <div class="speed-control-group">
                                <label>DFS Speed:</label>
                                <input type="range" class="speed-slider" data-algo="dfs" min="10" max="500" value="100">
                                <span class="speed-value" data-algo="dfs">100ms</span>
                            </div>
                            <div class="speed-control-group">
                                <label>Greedy Speed:</label>
                                <input type="range" class="speed-slider" data-algo="greedy" min="10" max="500" value="100">
                                <span class="speed-value" data-algo="greedy">100ms</span>
                            </div>
                            <div class="speed-control-group">
                                <label>A* Speed:</label>
                                <input type="range" class="speed-slider" data-algo="astar" min="10" max="500" value="100">
                                <span class="speed-value" data-algo="astar">100ms</span>
                            </div>
                        </div>
                        
                        <div class="control-buttons">
                            <button id="start-all-algorithms" class="modal-button primary">Start All Algorithms</button>
                            <button id="stop-all-algorithms" class="modal-button" style="display: none;">Stop All</button>
                            <button id="reset-all-algorithms" class="modal-button">Reset All</button>
                        </div>
                    </div>

                    <div class="multi-algorithm-summary">
                        <h3>Live Comparison</h3>
                        <div id="multi-algorithm-summary-content">
                            <p>Start the algorithms to see live comparison...</p>
                        </div>
                    </div>

                    <div class="algorithms-grid">
                        <div class="algorithm-container" data-algo="bfs">
                            <h3>Breadth-First Search</h3>
                            <div class="algorithm-canvas-container">
                                <canvas class="algorithm-canvas" width="250" height="250" data-algo="bfs"></canvas>
                            </div>
                            <div class="algorithm-stats">
                                <div class="stat">Path Length: <span class="path-length">-</span></div>
                                <div class="stat">Nodes Explored: <span class="nodes-explored">0</span></div>
                                <div class="stat">Time: <span class="time-taken">0ms</span></div>
                                <div class="status">Status: <span class="status-text">Ready</span></div>
                            </div>
                        </div>

                        <div class="algorithm-container" data-algo="dfs">
                            <h3>Depth-First Search</h3>
                            <div class="algorithm-canvas-container">
                                <canvas class="algorithm-canvas" width="250" height="250" data-algo="dfs"></canvas>
                            </div>
                            <div class="algorithm-stats">
                                <div class="stat">Path Length: <span class="path-length">-</span></div>
                                <div class="stat">Nodes Explored: <span class="nodes-explored">0</span></div>
                                <div class="stat">Time: <span class="time-taken">0ms</span></div>
                                <div class="status">Status: <span class="status-text">Ready</span></div>
                            </div>
                        </div>

                        <div class="algorithm-container" data-algo="greedy">
                            <h3>Greedy Best-First</h3>
                            <div class="algorithm-canvas-container">
                                <canvas class="algorithm-canvas" width="250" height="250" data-algo="greedy"></canvas>
                            </div>
                            <div class="algorithm-stats">
                                <div class="stat">Path Length: <span class="path-length">-</span></div>
                                <div class="stat">Nodes Explored: <span class="nodes-explored">0</span></div>
                                <div class="stat">Time: <span class="time-taken">0ms</span></div>
                                <div class="status">Status: <span class="status-text">Ready</span></div>
                            </div>
                        </div>

                        <div class="algorithm-container" data-algo="astar">
                            <h3>A* Search</h3>
                            <div class="algorithm-canvas-container">
                                <canvas class="algorithm-canvas" width="250" height="250" data-algo="astar"></canvas>
                            </div>
                            <div class="algorithm-stats">
                                <div class="stat">Path Length: <span class="path-length">-</span></div>
                                <div class="stat">Nodes Explored: <span class="nodes-explored">0</span></div>
                                <div class="stat">Time: <span class="time-taken">0ms</span></div>
                                <div class="status">Status: <span class="status-text">Ready</span></div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button id="close-multi-algorithm" class="modal-button">Close</button>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    setupEventListeners() {
        // Modal event listeners
        document.getElementById('multi-algorithm-modal').querySelector('.close-button').addEventListener('click', () => this.close());
        document.getElementById('close-multi-algorithm').addEventListener('click', () => this.close());

        // Control buttons
        document.getElementById('start-all-algorithms').addEventListener('click', () => this.startAllAlgorithms());
        document.getElementById('stop-all-algorithms').addEventListener('click', () => this.stopAllAlgorithms());
        document.getElementById('reset-all-algorithms').addEventListener('click', () => this.resetAllAlgorithms());

        // Speed controls
        document.querySelectorAll('.speed-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const algo = e.target.getAttribute('data-algo');
                this.speeds[algo] = 510 - e.target.value;
                document.querySelector(`.speed-value[data-algo="${algo}"]`).textContent = this.speeds[algo] + 'ms';
            });
        });

        // Close modal when clicking outside
        document.getElementById('multi-algorithm-modal').addEventListener('click', (event) => {
            if (event.target === event.currentTarget) {
                this.close();
            }
        });

        document.querySelector('#multi-algorithm-modal .close-button').addEventListener('click', () => this.close());
        document.getElementById('close-multi-algorithm').addEventListener('click', () => this.close());

        document.querySelector('#multi-algorithm-modal .fullscreen-button').addEventListener('click', () => this.toggleFullscreen());
    }

    open() {
        if (isSearching) return;
        
        const modal = document.getElementById('multi-algorithm-modal');
        modal.style.display = 'block';
        
        // Initialize all algorithms
        this.initializeAlgorithms();
    }

    close() {
        this.stopAllAlgorithms();
        const modal = document.getElementById('multi-algorithm-modal');
        modal.style.display = 'none';
    }

    initializeAlgorithms() {
        const algorithms = ['bfs', 'dfs', 'greedy', 'astar'];
        
        algorithms.forEach(algo => {
            this.resetAlgorithm(algo);
            this.drawAlgorithmMaze(algo);
        });
    }

    resetAlgorithm(algorithm) {
        const container = document.querySelector(`.algorithm-container[data-algo="${algorithm}"]`);
        container.querySelector('.path-length').textContent = '-';
        container.querySelector('.nodes-explored').textContent = '0';
        container.querySelector('.time-taken').textContent = '0ms';
        container.querySelector('.status-text').textContent = 'Ready';
        
        // Clear canvas
        const canvas = document.querySelector(`.algorithm-canvas[data-algo="${algorithm}"]`);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.generators[algorithm] = null;
    }

    drawAlgorithmMaze(algorithm) {
        const canvas = document.querySelector(`.algorithm-canvas[data-algo="${algorithm}"]`);
        const ctx = canvas.getContext('2d');
        const cellSize = canvas.width / MAZE_SIZE;

        // Draw maze
        for (let y = 0; y < MAZE_SIZE; y++) {
            for (let x = 0; x < MAZE_SIZE; x++) {
                const cellX = x * cellSize;
                const cellY = y * cellSize;
                
                if (maze[y][x] === 1) {
                    ctx.fillStyle = '#2c3e50';
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                } else {
                    ctx.fillStyle = '#ecf0f1';
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                }
                
                ctx.strokeStyle = '#bdc3c7';
                ctx.strokeRect(cellX, cellY, cellSize, cellSize);
            }
        }

        // Draw start and goal
        this.drawStartAndGoal(ctx, cellSize);
    }

    drawStartAndGoal(ctx, cellSize) {
        // Start position
        const startX = start.x * cellSize;
        const startY = start.y * cellSize;
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(startX, startY, cellSize, cellSize);
        
        // Goal position
        const goalX = goal.x * cellSize;
        const goalY = goal.y * cellSize;
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(goalX, goalY, cellSize, cellSize);
    }

    startAllAlgorithms() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        // Update UI
        document.getElementById('start-all-algorithms').style.display = 'none';
        document.getElementById('stop-all-algorithms').style.display = 'inline-block';
        
        // Initialize generators for each algorithm
        const algorithms = ['bfs', 'dfs', 'greedy', 'astar'];
        algorithms.forEach(algo => {
            this.startAlgorithm(algo);
        });
        
        // Start the animation loop
        this.animationInterval = setInterval(() => this.updateAllAlgorithms(), 16); // ~60fps
    }

    startAlgorithm(algorithm) {
        const startTime = performance.now();
        
        // Create a copy of the maze for this algorithm
        const algorithmMaze = JSON.parse(JSON.stringify(maze));
        const algorithmExploredNodes = [];
        const algorithmFinalPath = [];
        
        // Create generator based on algorithm type
        switch (algorithm) {
            case 'bfs':
                this.generators[algorithm] = this.bfsStepByStep(algorithmMaze, algorithmExploredNodes, algorithmFinalPath, startTime);
                break;
            case 'dfs':
                this.generators[algorithm] = this.dfsStepByStep(algorithmMaze, algorithmExploredNodes, algorithmFinalPath, startTime);
                break;
            case 'greedy':
                this.generators[algorithm] = this.greedyStepByStep(algorithmMaze, algorithmExploredNodes, algorithmFinalPath, startTime);
                break;
            case 'astar':
                this.generators[algorithm] = this.aStarStepByStep(algorithmMaze, algorithmExploredNodes, algorithmFinalPath, startTime);
                break;
        }
        
        // Update status
        this.updateAlgorithmStatus(algorithm, 'Running...');
    }

    updateAllAlgorithms() {
        const algorithms = ['bfs', 'dfs', 'greedy', 'astar'];
        let allCompleted = true;
        
        algorithms.forEach(algo => {
            if (this.generators[algo]) {
                const now = performance.now();
                const lastUpdate = this.generators[algo].lastUpdate || 0;
                
                // Check if it's time to update this algorithm based on its speed
                if (now - lastUpdate >= this.speeds[algo]) {
                    this.updateAlgorithm(algo);
                    this.generators[algo].lastUpdate = now;
                }
                
                if (!this.generators[algo].done) {
                    allCompleted = false;
                }
            }
        });
        
        // Update summary
        this.updateSummary();
        
        // Stop if all algorithms are done
        if (allCompleted) {
            this.stopAllAlgorithms();
        }
    }

    updateAlgorithm(algorithm) {
        const generator = this.generators[algorithm];
        if (!generator || generator.done) return;
        
        const result = generator.next();
        
        if (result.done) {
            generator.done = true;
            this.updateAlgorithmStatus(algorithm, result.value ? 'Completed!' : 'No path found');
            if (result.value) {
                this.drawFinalPath(algorithm, result.value);
            }
        } else {
            // Update visualization
            this.drawAlgorithmState(algorithm, generator.exploredNodes, generator.finalPath);
            
            // Update stats
            this.updateAlgorithmStats(algorithm, generator.nodesExplored, performance.now() - generator.startTime);
        }
    }

    stopAllAlgorithms() {
        this.isRunning = false;
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        // Update UI
        document.getElementById('start-all-algorithms').style.display = 'inline-block';
        document.getElementById('stop-all-algorithms').style.display = 'none';
        
        // Update status for all algorithms
        const algorithms = ['bfs', 'dfs', 'greedy', 'astar'];
        algorithms.forEach(algo => {
            if (this.generators[algo] && !this.generators[algo].done) {
                this.updateAlgorithmStatus(algo, 'Stopped');
            }
        });
    }

    resetAllAlgorithms() {
        this.stopAllAlgorithms();
        this.initializeAlgorithms();
        this.updateSummary();
    }

    // Algorithm implementations with state tracking
    *bfsStepByStep(algorithmMaze, exploredNodes, finalPath, startTime) {
        const queue = [{ x: start.x, y: start.y, path: [] }];
        const visited = new Set();
        visited.add(`${start.x},${start.y}`);
        
        let nodesExplored = 0;
        
        while (queue.length > 0) {
            let current = queue.shift();
            nodesExplored++;
            
            exploredNodes.push({ x: current.x, y: current.y });
            
            if (current.x === goal.x && current.y === goal.y) {
                finalPath = current.path.concat([{ x: current.x, y: current.y }]);
                this.updateAlgorithmStats('bfs', nodesExplored, performance.now() - startTime);
                this.updateAlgorithmPath('bfs', finalPath.length);
                return finalPath;
            }
            
            const neighbors = this.getNeighbors(current.x, current.y, algorithmMaze);
            for (let neighbor of neighbors) {
                const key = `${neighbor.x},${neighbor.y}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push({
                        x: neighbor.x,
                        y: neighbor.y,
                        path: current.path.concat([{ x: current.x, y: current.y }])
                    });
                }
            }
            
            // Store state in generator
            this.generators.bfs.exploredNodes = exploredNodes;
            this.generators.bfs.finalPath = finalPath;
            this.generators.bfs.nodesExplored = nodesExplored;
            this.generators.bfs.startTime = startTime;
            
            yield;
        }
        
        return null;
    }

    *dfsStepByStep(algorithmMaze, exploredNodes, finalPath, startTime) {
        const stack = [{ x: start.x, y: start.y, path: [] }];
        const visited = new Set();
        visited.add(`${start.x},${start.y}`);
        
        let nodesExplored = 0;
        
        while (stack.length > 0) {
            let current = stack.pop();
            nodesExplored++;
            
            exploredNodes.push({ x: current.x, y: current.y });
            
            if (current.x === goal.x && current.y === goal.y) {
                finalPath = current.path.concat([{ x: current.x, y: current.y }]);
                this.updateAlgorithmStats('dfs', nodesExplored, performance.now() - startTime);
                this.updateAlgorithmPath('dfs', finalPath.length);
                return finalPath;
            }
            
            const neighbors = this.getNeighbors(current.x, current.y, algorithmMaze);
            for (let neighbor of neighbors) {
                const key = `${neighbor.x},${neighbor.y}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    stack.push({
                        x: neighbor.x,
                        y: neighbor.y,
                        path: current.path.concat([{ x: current.x, y: current.y }])
                    });
                }
            }
            
            this.generators.dfs.exploredNodes = exploredNodes;
            this.generators.dfs.finalPath = finalPath;
            this.generators.dfs.nodesExplored = nodesExplored;
            this.generators.dfs.startTime = startTime;
            
            yield;
        }
        
        return null;
    }

    *greedyStepByStep(algorithmMaze, exploredNodes, finalPath, startTime) {
        const queue = [{ 
            x: start.x, 
            y: start.y, 
            path: [],
            heuristic: this.manhattanDistance(start.x, start.y, goal.x, goal.y)
        }];
        const visited = new Set();
        visited.add(`${start.x},${start.y}`);
        
        let nodesExplored = 0;
        
        while (queue.length > 0) {
            queue.sort((a, b) => a.heuristic - b.heuristic);
            let current = queue.shift();
            nodesExplored++;
            
            exploredNodes.push({ x: current.x, y: current.y });
            
            if (current.x === goal.x && current.y === goal.y) {
                finalPath = current.path.concat([{ x: current.x, y: current.y }]);
                this.updateAlgorithmStats('greedy', nodesExplored, performance.now() - startTime);
                this.updateAlgorithmPath('greedy', finalPath.length);
                return finalPath;
            }
            
            const neighbors = this.getNeighbors(current.x, current.y, algorithmMaze);
            for (let neighbor of neighbors) {
                const key = `${neighbor.x},${neighbor.y}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    const heuristic = this.manhattanDistance(neighbor.x, neighbor.y, goal.x, goal.y);
                    queue.push({
                        x: neighbor.x,
                        y: neighbor.y,
                        path: current.path.concat([{ x: current.x, y: current.y }]),
                        heuristic: heuristic
                    });
                }
            }
            
            this.generators.greedy.exploredNodes = exploredNodes;
            this.generators.greedy.finalPath = finalPath;
            this.generators.greedy.nodesExplored = nodesExplored;
            this.generators.greedy.startTime = startTime;
            
            yield;
        }
        
        return null;
    }

    *aStarStepByStep(algorithmMaze, exploredNodes, finalPath, startTime) {
        const openSet = [{ 
            x: start.x, 
            y: start.y, 
            g: 0,
            h: this.manhattanDistance(start.x, start.y, goal.x, goal.y),
            path: []
        }];
        
        const closedSet = new Set();
        let nodesExplored = 0;
        
        while (openSet.length > 0) {
            openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));
            let current = openSet.shift();
            nodesExplored++;
            
            exploredNodes.push({ x: current.x, y: current.y });
            
            if (current.x === goal.x && current.y === goal.y) {
                finalPath = current.path.concat([{ x: current.x, y: current.y }]);
                this.updateAlgorithmStats('astar', nodesExplored, performance.now() - startTime);
                this.updateAlgorithmPath('astar', finalPath.length);
                return finalPath;
            }
            
            closedSet.add(`${current.x},${current.y}`);
            
            const neighbors = this.getNeighbors(current.x, current.y, algorithmMaze);
            for (let neighbor of neighbors) {
                const key = `${neighbor.x},${neighbor.y}`;
                
                if (closedSet.has(key)) continue;
                
                const gScore = current.g + 1;
                
                let inOpenSet = false;
                let openSetNode;
                
                for (let node of openSet) {
                    if (node.x === neighbor.x && node.y === neighbor.y) {
                        inOpenSet = true;
                        openSetNode = node;
                        break;
                    }
                }
                
                if (!inOpenSet) {
                    openSet.push({
                        x: neighbor.x,
                        y: neighbor.y,
                        g: gScore,
                        h: this.manhattanDistance(neighbor.x, neighbor.y, goal.x, goal.y),
                        path: current.path.concat([{ x: current.x, y: current.y }])
                    });
                } else if (gScore < openSetNode.g) {
                    openSetNode.g = gScore;
                    openSetNode.path = current.path.concat([{ x: current.x, y: current.y }]);
                }
            }
            
            this.generators.astar.exploredNodes = exploredNodes;
            this.generators.astar.finalPath = finalPath;
            this.generators.astar.nodesExplored = nodesExplored;
            this.generators.astar.startTime = startTime;
            
            yield;
        }
        
        return null;
    }

    getNeighbors(x, y, maze) {
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }
        ];
        
        const neighbors = [];
        for (let dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            
            if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && maze[ny][nx] === 0) {
                neighbors.push({ x: nx, y: ny });
            }
        }
        
        return neighbors;
    }

    manhattanDistance(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    drawAlgorithmState(algorithm, exploredNodes, finalPath) {
        const canvas = document.querySelector(`.algorithm-canvas[data-algo="${algorithm}"]`);
        const ctx = canvas.getContext('2d');
        const cellSize = canvas.width / MAZE_SIZE;

        // Redraw base maze
        this.drawAlgorithmMaze(algorithm);

        // Draw explored nodes
        if (exploredNodes) {
            exploredNodes.forEach(node => {
                const cellX = node.x * cellSize;
                const cellY = node.y * cellSize;
                ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
                ctx.fillRect(cellX, cellY, cellSize, cellSize);
            });
        }

        // Draw final path
        if (finalPath && finalPath.length > 0) {
            finalPath.forEach(node => {
                const cellX = node.x * cellSize;
                const cellY = node.y * cellSize;
                ctx.fillStyle = 'rgba(241, 196, 15, 0.7)';
                ctx.fillRect(cellX, cellY, cellSize, cellSize);
            });
        }

        // Redraw start and goal on top
        this.drawStartAndGoal(ctx, cellSize);
    }

    drawFinalPath(algorithm, path) {
        const canvas = document.querySelector(`.algorithm-canvas[data-algo="${algorithm}"]`);
        const ctx = canvas.getContext('2d');
        const cellSize = canvas.width / MAZE_SIZE;

        // Draw final path
        path.forEach(node => {
            const cellX = node.x * cellSize;
            const cellY = node.y * cellSize;
            ctx.fillStyle = 'rgba(241, 196, 15, 0.9)';
            ctx.fillRect(cellX, cellY, cellSize, cellSize);
        });

        // Redraw start and goal on top
        this.drawStartAndGoal(ctx, cellSize);
    }

    updateAlgorithmStats(algorithm, nodesExplored, timeTaken) {
        const container = document.querySelector(`.algorithm-container[data-algo="${algorithm}"]`);
        container.querySelector('.nodes-explored').textContent = nodesExplored;
        container.querySelector('.time-taken').textContent = Math.round(timeTaken) + 'ms';
    }

    updateAlgorithmPath(algorithm, pathLength) {
        const container = document.querySelector(`.algorithm-container[data-algo="${algorithm}"]`);
        container.querySelector('.path-length').textContent = pathLength;
    }

    updateAlgorithmStatus(algorithm, status) {
        const container = document.querySelector(`.algorithm-container[data-algo="${algorithm}"]`);
        container.querySelector('.status-text').textContent = status;
        
        // Add color coding for status
        const statusElement = container.querySelector('.status-text');
        statusElement.className = 'status-text';
        if (status === 'Completed!') {
            statusElement.classList.add('completed');
        } else if (status === 'No path found') {
            statusElement.classList.add('failed');
        } else if (status === 'Running...') {
            statusElement.classList.add('running');
        }
    }

    updateSummary() {
        const summaryContent = document.getElementById('multi-algorithm-summary-content');
        const algorithms = ['bfs', 'dfs', 'greedy', 'astar'];
        
        let completedCount = 0;
        let runningCount = 0;
        let bestAlgorithm = null;
        let bestPathLength = Infinity;
        let bestTime = Infinity;
        
        algorithms.forEach(algo => {
            const container = document.querySelector(`.algorithm-container[data-algo="${algo}"]`);
            const status = container.querySelector('.status-text').textContent;
            const pathLength = container.querySelector('.path-length').textContent;
            const timeTaken = container.querySelector('.time-taken').textContent;
            
            if (status === 'Completed!') {
                completedCount++;
                const currentPathLength = parseInt(pathLength);
                const currentTime = parseInt(timeTaken);
                if (currentPathLength < bestPathLength) {
                    bestPathLength = currentPathLength;
                    bestAlgorithm = algo;
                } else if (currentPathLength === bestPathLength && currentTime < bestTime) {
                // If same path length, pick faster one
                bestTime = currentTime;
                bestAlgorithm = algo;
            }
            } else if (status === 'Running...') {
                runningCount++;
            }
        });
        
        let summaryHTML = '';
        
        if (completedCount === 0 && runningCount === 0) {
            summaryHTML = '<p>Start the algorithms to see live comparison...</p>';
        } else if (runningCount > 0) {
            summaryHTML = `<p><strong>${runningCount} algorithm(s) running...</strong></p>`;
            summaryHTML += `<p>${completedCount} algorithm(s) completed</p>`;
            if (bestAlgorithm) {
            const bestAlgoName = this.getAlgorithmFullName(bestAlgorithm);
            summaryHTML += `<p>Current best: <strong>${bestAlgoName}</strong> (Path: ${bestPathLength})</p>`;
        }
        } else {
            summaryHTML = `<p><strong>All algorithms completed!</strong></p>`;
            if (bestAlgorithm) {
                const bestAlgoName = this.getAlgorithmFullName(bestAlgorithm);
                const sameBestCount = algorithms.filter(algo => {
                const container = document.querySelector(`.algorithm-container[data-algo="${algo}"]`);
                const pathLength = container.querySelector('.path-length').textContent;

                return pathLength !== '-' && parseInt(pathLength) === bestPathLength;
            }).length;

                if (sameBestCount > 1) {
                summaryHTML += `<p>Multiple algorithms found the optimal path (${bestPathLength} steps)</p>`;
                summaryHTML += `<p>Best performer: <strong>${bestAlgoName}</strong> (fastest to find optimal path)</p>`;
            } else {
                summaryHTML += `<p>Best algorithm: <strong>${bestAlgoName}</strong> (Path length: ${bestPathLength})</p>`;
            }
            }
        }
        
        summaryContent.innerHTML = summaryHTML;
    }

    getAlgorithmFullName(algorithm) {
        const names = {
            'bfs': 'Breadth-First Search',
            'dfs': 'Depth-First Search',
            'greedy': 'Greedy Best-First Search',
            'astar': 'A* Search'
        };
        return names[algorithm];
    }

    toggleFullscreen() {
    const modal = document.getElementById('multi-algorithm-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    if (modal.classList.contains('fullscreen')) {
        // Exit fullscreen
        modal.classList.remove('fullscreen');
        modalContent.style.width = '';
        modalContent.style.maxWidth = '1200px';
        modalContent.style.margin = '2% auto';
        modalContent.style.maxHeight = '90vh';
        modalContent.style.borderRadius = '12px';
    } else {
        // Enter fullscreen
        modal.classList.add('fullscreen');
        modalContent.style.width = '98vw';
        modalContent.style.maxWidth = 'none';
        modalContent.style.margin = '1% auto';
        modalContent.style.maxHeight = '98vh';
        modalContent.style.borderRadius = '0';
    }
    
    // Adjust canvas sizes for multi-algorithm modal
    this.adjustCanvasSizes();
}

adjustCanvasSizes() {
    const modal = document.getElementById('multi-algorithm-modal');
    const isFullscreen = modal.classList.contains('fullscreen');
    
    const algorithms = ['bfs', 'dfs', 'greedy', 'astar'];
    algorithms.forEach(algo => {
        const canvas = document.querySelector(`.algorithm-canvas[data-algo="${algo}"]`);
        if (canvas) {
            if (isFullscreen) {
                canvas.width = 350;
                canvas.height = 350;
            } else {
                canvas.width = 250;
                canvas.height = 250;
            }
            // Redraw the algorithm state if it exists
            if (this.generators[algo]) {
                this.drawAlgorithmState(algo, this.generators[algo].exploredNodes, this.generators[algo].finalPath);
            } else {
                this.drawAlgorithmMaze(algo);
            }
        }
    });
}
}

// Create global instance
let multiAlgorithmModal;

// Initialize when page loads
window.addEventListener('load', () => {
    multiAlgorithmModal = new MultiAlgorithmModal();
});