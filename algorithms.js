// Search algorithm implementations

// Breadth-First Search
function bfs() {
    const startTime = performance.now();
    resetMaze();
    
    let queue = [{ x: start.x, y: start.y, path: [] }];
    let visited = new Set();
    visited.add(`${start.x},${start.y}`);
    
    let nodesExplored = 0;
    
    while (queue.length > 0) {
        let current = queue.shift();
        nodesExplored++;
        
        // Add to explored nodes for visualization
        exploredNodes.push({ x: current.x, y: current.y });
        
        // Check if we reached the goal
        if (current.x === goal.x && current.y === goal.y) {
            const endTime = performance.now();
            finalPath = current.path.concat([{ x: current.x, y: current.y }]);
            updateMetrics(finalPath.length, nodesExplored, Math.round(endTime - startTime), 'BFS');
            drawMaze();
            return finalPath;
        }
        
        // Get neighbors
        const neighbors = getNeighbors(current.x, current.y);
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
        
        // Visualize the search process
        if (nodesExplored % 5 === 0) {
            setTimeout(() => drawMaze(), 0);
        }
    }
    
    const endTime = performance.now();
    updateMetrics(0, nodesExplored, Math.round(endTime - startTime), 'BFS');
    alert('No path found!');
    return null;
}

function* bfsStepByStep() {
    const startTime = performance.now();
    resetMaze();
    
    let queue = [{ x: start.x, y: start.y, path: [] }];
    let visited = new Set();
    visited.add(`${start.x},${start.y}`);
    
    let nodesExplored = 0;
    
    while (queue.length > 0) {
        let current = queue.shift();
        nodesExplored++;
        
        // Add to explored nodes for visualization
        exploredNodes.push({ x: current.x, y: current.y });
        
        // Check if we reached the goal
        if (current.x === goal.x && current.y === goal.y) {
            const endTime = performance.now();
            updateMetrics(current.path.length + 1, nodesExplored, Math.round(endTime - startTime), 'BFS');
            yield; // Final yield to show the path
            return current.path.concat([{ x: current.x, y: current.y }]);
        }
        
        // Get neighbors
        const neighbors = getNeighbors(current.x, current.y);
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
        
        // Update metrics and yield for next step
        updateMetrics(0, nodesExplored, Math.round(performance.now() - startTime), 'BFS');
        yield;
    }
    
    const endTime = performance.now();
    updateMetrics(0, nodesExplored, Math.round(endTime - startTime), 'BFS');
    return null;
}

// Depth-First Search
function dfs() {
    const startTime = performance.now();
    resetMaze();
    
    let stack = [{ x: start.x, y: start.y, path: [] }];
    let visited = new Set();
    visited.add(`${start.x},${start.y}`);
    
    let nodesExplored = 0;
    
    while (stack.length > 0) {
        let current = stack.pop();
        nodesExplored++;
        
        // Add to explored nodes for visualization
        exploredNodes.push({ x: current.x, y: current.y });
        
        // Check if we reached the goal
        if (current.x === goal.x && current.y === goal.y) {
            const endTime = performance.now();
            finalPath = current.path.concat([{ x: current.x, y: current.y }]);
            updateMetrics(finalPath.length, nodesExplored, Math.round(endTime - startTime), 'DFS');
            drawMaze();
            return finalPath;
        }
        
        // Get neighbors
        const neighbors = getNeighbors(current.x, current.y);
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
        
        // Visualize the search process
        if (nodesExplored % 5 === 0) {
            setTimeout(() => drawMaze(), 0);
        }
    }
    
    const endTime = performance.now();
    updateMetrics(0, nodesExplored, Math.round(endTime - startTime), 'DFS');
    alert('No path found!');
    return null;
}

function* dfsStepByStep() {
    const startTime = performance.now();
    resetMaze();
    
    let stack = [{ x: start.x, y: start.y, path: [] }];
    let visited = new Set();
    visited.add(`${start.x},${start.y}`);
    
    let nodesExplored = 0;
    
    while (stack.length > 0) {
        let current = stack.pop();
        nodesExplored++;
        
        // Add to explored nodes for visualization
        exploredNodes.push({ x: current.x, y: current.y });
        
        // Check if we reached the goal
        if (current.x === goal.x && current.y === goal.y) {
            const endTime = performance.now();
            updateMetrics(current.path.length + 1, nodesExplored, Math.round(endTime - startTime), 'DFS');
            yield;
            return current.path.concat([{ x: current.x, y: current.y }]);
        }
        
        // Get neighbors
        const neighbors = getNeighbors(current.x, current.y);
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
        
        updateMetrics(0, nodesExplored, Math.round(performance.now() - startTime), 'DFS');
        yield;
    }
    
    const endTime = performance.now();
    updateMetrics(0, nodesExplored, Math.round(endTime - startTime), 'DFS');
    return null;
}

// Greedy Best-First Search
function greedyBestFirst() {
    const startTime = performance.now();
    resetMaze();
    
    // Priority queue based on heuristic (Manhattan distance to goal)
    let queue = [{ 
        x: start.x, 
        y: start.y, 
        path: [],
        heuristic: manhattanDistance(start.x, start.y, goal.x, goal.y)
    }];
    let visited = new Set();
    visited.add(`${start.x},${start.y}`);
    
    let nodesExplored = 0;
    
    while (queue.length > 0) {
        // Sort by heuristic (lowest first)
        queue.sort((a, b) => a.heuristic - b.heuristic);
        let current = queue.shift();
        nodesExplored++;
        
        // Add to explored nodes for visualization
        exploredNodes.push({ x: current.x, y: current.y });
        
        // Check if we reached the goal
        if (current.x === goal.x && current.y === goal.y) {
            const endTime = performance.now();
            finalPath = current.path.concat([{ x: current.x, y: current.y }]);
            updateMetrics(finalPath.length, nodesExplored, Math.round(endTime - startTime), 'Greedy Best-First');
            drawMaze();
            return finalPath;
        }
        
        // Get neighbors
        const neighbors = getNeighbors(current.x, current.y);
        for (let neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key)) {
                visited.add(key);
                const heuristic = manhattanDistance(neighbor.x, neighbor.y, goal.x, goal.y);
                queue.push({
                    x: neighbor.x,
                    y: neighbor.y,
                    path: current.path.concat([{ x: current.x, y: current.y }]),
                    heuristic: heuristic
                });
            }
        }
        
        // Visualize the search process
        if (nodesExplored % 5 === 0) {
            setTimeout(() => drawMaze(), 0);
        }
    }
    
    const endTime = performance.now();
    updateMetrics(0, nodesExplored, Math.round(endTime - startTime), 'Greedy Best-First');
    alert('No path found!');
    return null;
}

function* greedyStepByStep() {
    const startTime = performance.now();
    resetMaze();
    
    let queue = [{ 
        x: start.x, 
        y: start.y, 
        path: [],
        heuristic: manhattanDistance(start.x, start.y, goal.x, goal.y)
    }];
    let visited = new Set();
    visited.add(`${start.x},${start.y}`);
    
    let nodesExplored = 0;
    
    while (queue.length > 0) {
        // Sort by heuristic (lowest first)
        queue.sort((a, b) => a.heuristic - b.heuristic);
        let current = queue.shift();
        nodesExplored++;
        
        // Add to explored nodes for visualization
        exploredNodes.push({ x: current.x, y: current.y });
        
        // Check if we reached the goal
        if (current.x === goal.x && current.y === goal.y) {
            const endTime = performance.now();
            updateMetrics(current.path.length + 1, nodesExplored, Math.round(endTime - startTime), 'Greedy Best-First');
            yield;
            return current.path.concat([{ x: current.x, y: current.y }]);
        }
        
        // Get neighbors
        const neighbors = getNeighbors(current.x, current.y);
        for (let neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key)) {
                visited.add(key);
                const heuristic = manhattanDistance(neighbor.x, neighbor.y, goal.x, goal.y);
                queue.push({
                    x: neighbor.x,
                    y: neighbor.y,
                    path: current.path.concat([{ x: current.x, y: current.y }]),
                    heuristic: heuristic
                });
            }
        }
        
        updateMetrics(0, nodesExplored, Math.round(performance.now() - startTime), 'Greedy Best-First');
        yield;
    }
    
    const endTime = performance.now();
    updateMetrics(0, nodesExplored, Math.round(endTime - startTime), 'Greedy Best-First');
    return null;
}

// A* Search
function aStar() {
    const startTime = performance.now();
    resetMaze();
    
    // f(n) = g(n) + h(n)
    let openSet = [{ 
        x: start.x, 
        y: start.y, 
        g: 0, // cost from start to current node
        h: manhattanDistance(start.x, start.y, goal.x, goal.y), // heuristic
        path: []
    }];
    
    let closedSet = new Set();
    let nodesExplored = 0;
    
    while (openSet.length > 0) {
        // Sort by f(n) = g(n) + h(n) (lowest first)
        openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));
        let current = openSet.shift();
        nodesExplored++;
        
        // Add to explored nodes for visualization
        exploredNodes.push({ x: current.x, y: current.y });
        
        // Check if we reached the goal
        if (current.x === goal.x && current.y === goal.y) {
            const endTime = performance.now();
            finalPath = current.path.concat([{ x: current.x, y: current.y }]);
            updateMetrics(finalPath.length, nodesExplored, Math.round(endTime - startTime), 'A*');
            drawMaze();
            return finalPath;
        }
        
        closedSet.add(`${current.x},${current.y}`);
        
        // Get neighbors
        const neighbors = getNeighbors(current.x, current.y);
        for (let neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.y}`;
            
            if (closedSet.has(key)) continue;
            
            // Calculate g score (cost from start to this neighbor)
            const gScore = current.g + 1;
            
            // Check if this neighbor is already in the open set
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
                // Add to open set
                openSet.push({
                    x: neighbor.x,
                    y: neighbor.y,
                    g: gScore,
                    h: manhattanDistance(neighbor.x, neighbor.y, goal.x, goal.y),
                    path: current.path.concat([{ x: current.x, y: current.y }])
                });
            } else if (gScore < openSetNode.g) {
                // Update the existing node if we found a better path
                openSetNode.g = gScore;
                openSetNode.path = current.path.concat([{ x: current.x, y: current.y }]);
            }
        }
        
        // Visualize the search process
        if (nodesExplored % 5 === 0) {
            setTimeout(() => drawMaze(), 0);
        }
    }
    
    const endTime = performance.now();
    updateMetrics(0, nodesExplored, Math.round(endTime - startTime), 'A*');
    alert('No path found!');
    return null;
}

function* aStarStepByStep() {
    const startTime = performance.now();
    resetMaze();
    
    let openSet = [{ 
        x: start.x, 
        y: start.y, 
        g: 0,
        h: manhattanDistance(start.x, start.y, goal.x, goal.y),
        path: []
    }];
    
    let closedSet = new Set();
    let nodesExplored = 0;
    
    while (openSet.length > 0) {
        // Sort by f(n) = g(n) + h(n) (lowest first)
        openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));
        let current = openSet.shift();
        nodesExplored++;
        
        // Add to explored nodes for visualization
        exploredNodes.push({ x: current.x, y: current.y });
        
        // Check if we reached the goal
        if (current.x === goal.x && current.y === goal.y) {
            const endTime = performance.now();
            updateMetrics(current.path.length + 1, nodesExplored, Math.round(endTime - startTime), 'A*');
            yield;
            return current.path.concat([{ x: current.x, y: current.y }]);
        }
        
        closedSet.add(`${current.x},${current.y}`);
        
        // Get neighbors
        const neighbors = getNeighbors(current.x, current.y);
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
                    h: manhattanDistance(neighbor.x, neighbor.y, goal.x, goal.y),
                    path: current.path.concat([{ x: current.x, y: current.y }])
                });
            } else if (gScore < openSetNode.g) {
                openSetNode.g = gScore;
                openSetNode.path = current.path.concat([{ x: current.x, y: current.y }]);
            }
        }
        
        updateMetrics(0, nodesExplored, Math.round(performance.now() - startTime), 'A*');
        yield;
    }
    
    const endTime = performance.now();
    updateMetrics(0, nodesExplored, Math.round(endTime - startTime), 'A*');
    return null;
}