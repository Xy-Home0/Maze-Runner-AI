// Maze configuration
const MAZE_SIZE = 15;
const CELL_SIZE = 40;
const WALL_PROBABILITY = 0.3;

// Maze state
let maze = [];
let start = { x: 0, y: 0 };
let goal = { x: MAZE_SIZE - 1, y: MAZE_SIZE - 1 };
let exploredNodes = [];
let finalPath = [];

// Canvas context
let canvas, ctx;

// Initialize the maze
function initMaze() {
    canvas = document.getElementById('maze-canvas');
    ctx = canvas.getContext('2d');
    
    generateMaze();
    drawMaze();
}

// Generate a random maze
function generateMaze() {
    maze = [];
    exploredNodes = [];
    finalPath = [];
    
    // Initialize with empty cells
    for (let y = 0; y < MAZE_SIZE; y++) {
        maze[y] = [];
        for (let x = 0; x < MAZE_SIZE; x++) {
            // Start and goal positions are always empty
            if ((x === start.x && y === start.y) || (x === goal.x && y === goal.y)) {
                maze[y][x] = 0;
            } else {
                // Randomly place walls
                maze[y][x] = Math.random() < WALL_PROBABILITY ? 1 : 0;
            }
        }
    }
    
    // Ensure there's a path from start to goal
    ensurePathExists();
}

// Simple algorithm to ensure a path exists
function ensurePathExists() {
    // Create a copy of the maze for path checking
    let tempMaze = JSON.parse(JSON.stringify(maze));
    
    // Use DFS to check if there's a path
    let stack = [start];
    tempMaze[start.y][start.x] = 2; // Mark as visited
    
    while (stack.length > 0) {
        let current = stack.pop();
        
        // If we reached the goal, we're done
        if (current.x === goal.x && current.y === goal.y) {
            return;
        }
        
        // Check all four directions
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }  // left
        ];
        
        for (let dir of directions) {
            let nx = current.x + dir.dx;
            let ny = current.y + dir.dy;
            
            if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE && 
                tempMaze[ny][nx] === 0) {
                stack.push({ x: nx, y: ny });
                tempMaze[ny][nx] = 2; // Mark as visited
            }
        }
    }
    
    // If we get here, there's no path, so clear a path
    clearPath();
}

// Clear a direct path from start to goal
function clearPath() {
    let x = start.x, y = start.y;
    
    while (x !== goal.x || y !== goal.y) {
        if (x < goal.x) {
            x++;
        } else if (x > goal.x) {
            x--;
        } else if (y < goal.y) {
            y++;
        } else if (y > goal.y) {
            y--;
        }
        
        maze[y][x] = 0;
    }
}

// Draw the maze on the canvas
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cells
    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            const cellX = x * CELL_SIZE;
            const cellY = y * CELL_SIZE;
            
            // Draw cell background
            if (maze[y][x] === 1) {
                // Wall
                ctx.fillStyle = '#2c3e50';
                ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
            } else {
                // Empty cell
                ctx.fillStyle = '#ecf0f1';
                ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
            }
            
            // Draw cell border
            ctx.strokeStyle = '#bdc3c7';
            ctx.strokeRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
        }
    }
    
    // Draw explored nodes
    for (let node of exploredNodes) {
        const cellX = node.x * CELL_SIZE;
        const cellY = node.y * CELL_SIZE;
        
        ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
        ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
    }
    
    // Draw final path
    for (let node of finalPath) {
        const cellX = node.x * CELL_SIZE;
        const cellY = node.y * CELL_SIZE;
        
        ctx.fillStyle = 'rgba(241, 196, 15, 0.7)';
        ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
    }
    
    // Draw start and goal
    drawStartAndGoal();
}

// Draw start and goal positions
function drawStartAndGoal() {
    // Start position
    const startX = start.x * CELL_SIZE;
    const startY = start.y * CELL_SIZE;
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(startX, startY, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', startX + CELL_SIZE/2, startY + CELL_SIZE/2);
    
    // Goal position
    const goalX = goal.x * CELL_SIZE;
    const goalY = goal.y * CELL_SIZE;
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(goalX, goalY, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = 'white';
    ctx.fillText('G', goalX + CELL_SIZE/2, goalY + CELL_SIZE/2);
}

// Check if a position is valid (within bounds and not a wall)
function isValidPosition(x, y) {
    return x >= 0 && x < MAZE_SIZE && y >= 0 && y < MAZE_SIZE && maze[y][x] === 0;
}

// Get neighbors of a position
function getNeighbors(x, y) {
    const directions = [
        { dx: 0, dy: -1 }, // up
        { dx: 1, dy: 0 },  // right
        { dx: 0, dy: 1 },  // down
        { dx: -1, dy: 0 }  // left
    ];
    
    const neighbors = [];
    for (let dir of directions) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;
        
        if (isValidPosition(nx, ny)) {
            neighbors.push({ x: nx, y: ny });
        }
    }
    
    return neighbors;
}

// Calculate Manhattan distance between two points
function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Reset the maze visualization
function resetMaze() {
    exploredNodes = [];
    finalPath = [];
    drawMaze();
}

// Update performance metrics
function updateMetrics(pathLength, nodesExplored, timeTaken, algorithm) {
    document.getElementById('path-length').textContent = pathLength;
    document.getElementById('nodes-explored').textContent = nodesExplored;
    document.getElementById('time-taken').textContent = timeTaken;
    document.getElementById('current-algorithm').textContent = algorithm;
}