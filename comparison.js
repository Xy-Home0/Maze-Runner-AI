// Comparison Modal Functionality
class ComparisonModal {
    constructor() {
        this.comparisonResults = {
            bfs: null,
            dfs: null,
            greedy: null,
            astar: null
        };
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        const modalHTML = `
        <div id="comparison-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Algorithm Comparison Results</h2>
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
                    <div class="comparison-controls">
                        <button id="run-comparison-btn" class="compare-button">Run Comparison</button>
                        <div class="loading-indicator" id="loading-indicator" style="display: none;">
                            <div class="spinner"></div>
                            <span>Running algorithms...</span>
                        </div>
                    </div>
                    
                    <div class="comparison-results" id="comparison-results" style="display: none;">
                        <div class="comparison-table-container">
                            <table id="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Algorithm</th>
                                        <th>Path Length</th>
                                        <th>Nodes Explored</th>
                                        <th>Time Taken (ms)</th>
                                        <th>Optimal</th>
                                        <th>Complete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id="bfs-row">
                                        <td>Breadth-First Search</td>
                                        <td class="path-length">-</td>
                                        <td class="nodes-explored">-</td>
                                        <td class="time-taken">-</td>
                                        <td class="optimal">✅</td>
                                        <td class="complete">✅</td>
                                    </tr>
                                    <tr id="dfs-row">
                                        <td>Depth-First Search</td>
                                        <td class="path-length">-</td>
                                        <td class="nodes-explored">-</td>
                                        <td class="time-taken">-</td>
                                        <td class="optimal">❌</td>
                                        <td class="complete">✅*</td>
                                    </tr>
                                    <tr id="greedy-row">
                                        <td>Greedy Best-First</td>
                                        <td class="path-length">-</td>
                                        <td class="nodes-explored">-</td>
                                        <td class="time-taken">-</td>
                                        <td class="optimal">❌</td>
                                        <td class="complete">❌</td>
                                    </tr>
                                    <tr id="astar-row">
                                        <td>A* Search</td>
                                        <td class="path-length">-</td>
                                        <td class="nodes-explored">-</td>
                                        <td class="time-taken">-</td>
                                        <td class="optimal">✅</td>
                                        <td class="complete">✅</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="comparison-summary">
                            <h3>Summary</h3>
                            <div id="comparison-summary-content">
                                <!-- Summary will be populated here -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="comparison-notes">
                        <p><strong>Notes:</strong></p>
                        <ul>
                            <li>✅* DFS is complete only for finite state spaces</li>
                            <li><strong>Optimal</strong> = Finds the shortest path</li>
                            <li><strong>Complete</strong> = Guaranteed to find a solution if one exists</li>
                            <li>Best results are highlighted in <span style="color: #27ae60; font-weight: bold;">green</span></li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-comparison" class="modal-button">Close</button>
                    <button id="visualize-all" class="modal-button primary" style="display: none;">Visualize All Algorithms</button>
                </div>
            </div>
        </div>
        `;

        // Inject modal into DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    setupEventListeners() {
        // Modal event listeners
        document.querySelector('.close-button').addEventListener('click', () => this.close());
        document.getElementById('close-comparison').addEventListener('click', () => this.close());
        document.getElementById('run-comparison-btn').addEventListener('click', () => this.runComparison());
        document.getElementById('visualize-all').addEventListener('click', () => this.visualizeAllAlgorithms());
        document.querySelector('#comparison-modal .close-button').addEventListener('click', () => this.close());
        document.getElementById('close-comparison').addEventListener('click', () => this.close());

        // Close modal when clicking outside
        document.getElementById('comparison-modal').addEventListener('click', (event) => {
            if (event.target === event.currentTarget) {
                this.close();
            }
        });
        document.querySelector('#comparison-modal .fullscreen-button').addEventListener('click', () => this.toggleFullscreen());
    }

    open() {
        if (isSearching) return;
        
        const modal = document.getElementById('comparison-modal');
        modal.style.display = 'block';
        
        // Reset previous results
        this.resetUI();
    }

    close() {
        const modal = document.getElementById('comparison-modal');
        modal.style.display = 'none';
        this.stopComparison();
    }

    resetUI() {
        // Hide results, show run button
        document.getElementById('comparison-results').style.display = 'none';
        document.getElementById('run-comparison-btn').style.display = 'block';
        document.getElementById('loading-indicator').style.display = 'none';
        document.getElementById('visualize-all').style.display = 'none';
        
        // Reset table
        this.resetComparisonTable();
        
        // Enable run button
        document.getElementById('run-comparison-btn').disabled = false;
    }

    runComparison() {
        const runBtn = document.getElementById('run-comparison-btn');
        const loadingIndicator = document.getElementById('loading-indicator');
        const resultsSection = document.getElementById('comparison-results');
        
        // UI state changes
        runBtn.disabled = true;
        runBtn.style.display = 'none';
        loadingIndicator.style.display = 'flex';
        resultsSection.style.display = 'none';
        
        // Reset comparison results
        this.comparisonResults = { bfs: null, dfs: null, greedy: null, astar: null };
        this.resetComparisonTable();
        
        // Run each algorithm sequentially
        this.runAlgorithmComparison('bfs')
            .then(() => this.runAlgorithmComparison('dfs'))
            .then(() => this.runAlgorithmComparison('greedy'))
            .then(() => this.runAlgorithmComparison('astar'))
            .then(() => {
                // Show results
                this.updateComparisonTable();
                this.updateComparisonSummary();
                resultsSection.style.display = 'block';
                loadingIndicator.style.display = 'none';
                document.getElementById('visualize-all').style.display = 'block';
            })
            .catch(error => {
                console.error('Comparison error:', error);
                loadingIndicator.style.display = 'none';
                runBtn.style.display = 'block';
                runBtn.disabled = false;
                alert('Error running comparison. Please try again.');
            });
    }

    runAlgorithmComparison(algorithm) {
        return new Promise((resolve) => {
            // Store current maze state
            const originalMaze = JSON.parse(JSON.stringify(maze));
            
            setTimeout(() => {
                const startTime = performance.now();
                
                let result;
                switch (algorithm) {
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
                
                const endTime = performance.now();
                const timeTaken = Math.round(endTime - startTime);
                
                this.comparisonResults[algorithm] = {
                    pathLength: result ? result.length : 0,
                    nodesExplored: exploredNodes.length,
                    timeTaken: timeTaken,
                    found: !!result
                };
                
                // Restore original maze state
                maze = originalMaze;
                resetMaze();
                
                // Update table row for this algorithm
                this.updateAlgorithmRow(algorithm);
                
                resolve();
            }, 100);
        });
    }

    stopComparison() {
        // Clean up any running processes
        const loadingIndicator = document.getElementById('loading-indicator');
        loadingIndicator.style.display = 'none';
    }

    resetComparisonTable() {
        const rows = ['bfs', 'dfs', 'greedy', 'astar'];
        rows.forEach(algo => {
            const row = document.getElementById(`${algo}-row`);
            row.querySelector('.path-length').textContent = '-';
            row.querySelector('.nodes-explored').textContent = '-';
            row.querySelector('.time-taken').textContent = '-';
            row.classList.remove('best-result', 'good-result');
        });
        
        // Reset summary
        document.getElementById('comparison-summary-content').innerHTML = 
            '<p>Run the comparison to see algorithm performance analysis...</p>';
    }

    updateAlgorithmRow(algorithm) {
        const result = this.comparisonResults[algorithm];
        if (!result) return;
        
        const row = document.getElementById(`${algorithm}-row`);
        const pathLengthCell = row.querySelector('.path-length');
        const nodesExploredCell = row.querySelector('.nodes-explored');
        const timeTakenCell = row.querySelector('.time-taken');
        
        pathLengthCell.textContent = result.found ? result.pathLength : 'No path';
        nodesExploredCell.textContent = result.nodesExplored;
        timeTakenCell.textContent = result.timeTaken;
        
        // Remove any previous highlighting
        pathLengthCell.classList.remove('best-result', 'good-result');
        nodesExploredCell.classList.remove('best-result', 'good-result');
        timeTakenCell.classList.remove('best-result', 'good-result');
    }

    updateComparisonTable() {
        // Find best results for highlighting
        const validResults = Object.entries(this.comparisonResults)
            .filter(([_, result]) => result && result.found);
        
        if (validResults.length === 0) return;
        
        // Find best values
        const bestPathLength = Math.min(...validResults.map(([_, result]) => result.pathLength));
        const bestNodesExplored = Math.min(...validResults.map(([_, result]) => result.nodesExplored));
        const bestTimeTaken = Math.min(...validResults.map(([_, result]) => result.timeTaken));
        
        // Apply highlighting
        Object.entries(this.comparisonResults).forEach(([algorithm, result]) => {
            if (!result || !result.found) return;
            
            const row = document.getElementById(`${algorithm}-row`);
            const pathLengthCell = row.querySelector('.path-length');
            const nodesExploredCell = row.querySelector('.nodes-explored');
            const timeTakenCell = row.querySelector('.time-taken');
            
            if (result.pathLength === bestPathLength) {
                pathLengthCell.classList.add('best-result');
            }
            
            if (result.nodesExplored === bestNodesExplored) {
                nodesExploredCell.classList.add('best-result');
            }
            
            if (result.timeTaken === bestTimeTaken) {
                timeTakenCell.classList.add('best-result');
            }
        });
    }

    updateComparisonSummary() {
        const validResults = Object.entries(this.comparisonResults)
            .filter(([_, result]) => result && result.found);
        
        const summaryContent = document.getElementById('comparison-summary-content');
        
        if (validResults.length === 0) {
            summaryContent.innerHTML = '<p>❌ No algorithms found a path in this maze configuration.</p>';
            return;
        }
        
        // Count successful algorithms
        const bestAlgorithm = this.findBestAlgorithm();
        
        let summaryHTML = `<p>✅ <strong>${validResults.length} out of 4 algorithms</strong> found a path</p>`;
        summaryHTML += `<div class="best-algorithm-card">`;
        summaryHTML += `<p><strong>Best Performer:</strong> ${bestAlgorithm.name}</p>`;
        summaryHTML += `<p><strong>Why:</strong> ${bestAlgorithm.reason}</p>`;
        
        if (bestAlgorithm.details) {
        summaryHTML += `<div class="performance-details">`;
        summaryHTML += `<div>Path Length: <strong>${bestAlgorithm.details.pathLength}</strong> steps</div>`;
        summaryHTML += `<div>Nodes Explored: <strong>${bestAlgorithm.details.nodesExplored}</strong></div>`;
        summaryHTML += `<div>Time: <strong>${bestAlgorithm.details.timeTaken}ms</strong></div>`;
        summaryHTML += `<div>Performance Score: <strong>${bestAlgorithm.details.score}/1.0</strong></div>`;
        summaryHTML += `</div>`;
    }
    
    summaryHTML += `</div>`;

    summaryHTML += `<div style="margin-top: 15px;"><strong>Algorithm Analysis:</strong><ul>`;

    // Add specific insights for each algorithm
    validResults.forEach(([algo, result]) => {
        const algoName = this.getAlgorithmFullName(algo);
        summaryHTML += `<li><strong>${algoName}</strong>: `;
        
        const insights = [];
        
        // Path length insight
        if (result.pathLength === Math.min(...validResults.map(([_, r]) => r.pathLength))) {
            insights.push('found shortest path');
        } else {
            const shortest = Math.min(...validResults.map(([_, r]) => r.pathLength));
            insights.push(`path ${result.pathLength - shortest} steps longer than best`);
        }
        
        // Efficiency insight
        if (result.nodesExplored === Math.min(...validResults.map(([_, r]) => r.nodesExplored))) {
            insights.push('most efficient');
        }
        
        // Speed insight
        if (result.timeTaken === Math.min(...validResults.map(([_, r]) => r.timeTaken))) {
            insights.push('fastest');
        }
        
        summaryHTML += insights.join(', ');
        summaryHTML += `</li>`;
    });

    summaryHTML += `</ul></div>`;

    // Add educational insight
    summaryHTML += `<div class="educational-insight">`;
    const mazeType = this.analyzeMazeType();
    summaryHTML += `<p><strong>Maze Insight:</strong> ${mazeType}</p>`;
    summaryHTML += `</div>`;

    summaryContent.innerHTML = summaryHTML;
}

analyzeMazeType() {
    // Simple maze analysis based on wall density and structure
    let emptyCells = 0;
    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            if (maze[y][x] === 0) emptyCells++;
        }
    }
    
    const density = 1 - (emptyCells / (MAZE_SIZE * MAZE_SIZE));
    
    if (density < 0.2) {
        return "Open maze - Greedy and A* usually perform well";
    } else if (density > 0.4) {
        return "Dense maze - BFS and A* are more reliable";
    } else {
        return "Moderate complexity - Algorithm performance varies";
    }
    }

    findBestAlgorithm() {
    const validResults = Object.entries(this.comparisonResults)
        .filter(([_, result]) => result && result.found);

    if (validResults.length === 0) {
        return { name: 'None', reason: 'No algorithm found a path' };
    }

    if (validResults.length === 1) {
        const [algo, result] = validResults[0];
        return {
            name: this.getAlgorithmFullName(algo),
            reason: 'Only this algorithm found a path'
        };
    }

    // Calculate normalized scores for each metric (0 to 1, where 1 is best)
    const scores = validResults.map(([algo, result]) => {
        // Get all values for normalization
        const pathLengths = validResults.map(([_, r]) => r.pathLength);
        const nodesExplored = validResults.map(([_, r]) => r.nodesExplored);
        const timeTaken = validResults.map(([_, r]) => r.timeTaken);

        const minPathLength = Math.min(...pathLengths);
        const maxPathLength = Math.max(...pathLengths);
        const minNodes = Math.min(...nodesExplored);
        const maxNodes = Math.max(...nodesExplored);
        const minTime = Math.min(...timeTaken);
        const maxTime = Math.max(...timeTaken);

        // Normalize scores (1 is best, 0 is worst)
        const pathLengthScore = maxPathLength === minPathLength ? 
            1 : 1 - ((result.pathLength - minPathLength) / (maxPathLength - minPathLength));
        
        const nodesExploredScore = maxNodes === minNodes ? 
            1 : 1 - ((result.nodesExplored - minNodes) / (maxNodes - minNodes));
        
        const timeScore = maxTime === minTime ? 
            1 : 1 - ((result.timeTaken - minTime) / (maxTime - minTime));

        // Weighted composite score
        // Path length is most important (50%), then efficiency (30%), then speed (20%)
        const compositeScore = 
            (pathLengthScore * 0.5) + 
            (nodesExploredScore * 0.3) + 
            (timeScore * 0.2);

        return {
            algorithm: algo,
            pathLengthScore,
            nodesExploredScore,
            timeScore,
            compositeScore,
            pathLength: result.pathLength,
            nodesExplored: result.nodesExplored,
            timeTaken: result.timeTaken
        };
    });

    // Find the best overall score
    const best = scores.reduce((best, current) => 
        current.compositeScore > best.compositeScore ? current : best
    );

    // Determine the reason based on strengths
    let reason = this.generateReason(best, scores);

    return {
        name: this.getAlgorithmFullName(best.algorithm),
        reason: reason,
        details: {
            pathLength: best.pathLength,
            nodesExplored: best.nodesExplored,
            timeTaken: best.timeTaken,
            score: Math.round(best.compositeScore * 100) / 100
        }
    };
}

generateReason(bestAlgorithm, allScores) {
    const algo = bestAlgorithm.algorithm;
    const strengths = [];

    // Check if this algorithm has the best path length
    const hasBestPath = allScores.every(score => 
        score.algorithm === algo || score.pathLengthScore <= bestAlgorithm.pathLengthScore
    );
    if (hasBestPath) {
        strengths.push('found the shortest path');
    }

    // Check if this algorithm is most efficient (nodes explored)
    const hasBestEfficiency = allScores.every(score => 
        score.algorithm === algo || score.nodesExploredScore <= bestAlgorithm.nodesExploredScore
    );
    if (hasBestEfficiency) {
        strengths.push('most efficient exploration');
    }

    // Check if this algorithm is fastest
    const hasBestSpeed = allScores.every(score => 
        score.algorithm === algo || score.timeScore <= bestAlgorithm.timeScore
    );
    if (hasBestSpeed) {
        strengths.push('fastest execution');
    }

    // If no clear strengths, describe balanced performance
    if (strengths.length === 0) {
        const balancedStrengths = [];
        if (bestAlgorithm.pathLengthScore > 0.8) {
            balancedStrengths.push('good path length');
        }
        if (bestAlgorithm.nodesExploredScore > 0.8) {
            balancedStrengths.push('good efficiency');
        }
        if (bestAlgorithm.timeScore > 0.8) {
            balancedStrengths.push('good speed');
        }
        
        if (balancedStrengths.length > 0) {
            strengths.push('balanced performance with ' + balancedStrengths.join(', '));
        } else {
            strengths.push('best overall balance of performance metrics');
        }
    }

    // Algorithm-specific context
    const algoContext = {
        'bfs': 'Systematic level-by-level search',
        'dfs': 'Depth-first exploration strategy',
        'greedy': 'Heuristic-guided approach',
        'astar': 'Optimal pathfinding with heuristic'
    };

    return `${algoContext[algo]} - ${strengths.join(' and ')}`;
}

    visualizeAllAlgorithms() {
        const bestAlgorithm = this.findBestAlgorithm();
        let algoKey = '';
        
        if (bestAlgorithm.name.includes('Breadth')) {
            algoKey = 'bfs';
        } else if (bestAlgorithm.name.includes('Depth')) {
            algoKey = 'dfs';
        } else if (bestAlgorithm.name.includes('Greedy')) {
            algoKey = 'greedy';
        } else if (bestAlgorithm.name.includes('A*')) {
            algoKey = 'astar';
        }
        
        if (algoKey) {
            selectAlgorithm(algoKey);
            this.close();
            multiAlgorithmModal.open();
            // Start animation after a short delay to allow modal to close
            setTimeout(() => {
                if (!isAnimating) {
                    startAnimation();
                }
            }, 300);
        }
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
    const modal = document.getElementById('comparison-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    if (modal.classList.contains('fullscreen')) {
        // Exit fullscreen
        modal.classList.remove('fullscreen');
        modalContent.style.width = '';
        modalContent.style.maxWidth = '900px';
        modalContent.style.margin = '2% auto';
        modalContent.style.maxHeight = '90vh';
        modalContent.style.borderRadius = '12px';
    } else {
        // Enter fullscreen
        modal.classList.add('fullscreen');
        modalContent.style.width = '95vw';
        modalContent.style.maxWidth = 'none';
        modalContent.style.margin = '1% auto';
        modalContent.style.maxHeight = '98vh';
        modalContent.style.borderRadius = '0';
    }
}
}

// Create global instance
let comparisonModal;

// Initialize when page loads
window.addEventListener('load', () => {
    comparisonModal = new ComparisonModal();
});