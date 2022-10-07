// Create graph to track moves
class Graph {
  constructor() {
    this.nodes = {};
  }
  // Create 8 by 8 board array
  createBoard() {
    let result = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        result.push([i, j]);
      }
    }
    return result;
  }
  // Give each square an array to store all possible moves from that square
  initializeNodes() {
    let board = this.createBoard();
    board.forEach((pair) => {
      this.nodes[JSON.stringify(pair)] = [];
    });
  }

  // Add a new edge
  addEdge(src, dest) {
    if (!src || !dest) return null;
    if (!this.nodes[JSON.stringify(dest)].includes(JSON.stringify(src))) {
      this.nodes[JSON.stringify(dest)].push(JSON.stringify(src));
    }
    if (!this.nodes[JSON.stringify(src)].includes(JSON.stringify(dest))) {
      this.nodes[JSON.stringify(src)].push(JSON.stringify(dest));
    }
  }

  // Give each square accessible by the knight all its possible moves
  allMoves(pos, target, nodes = this.nodes) {
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        let sum = Math.abs(i) + Math.abs(j);
        let newNode = [pos[0] + i, pos[1] + j];
        if (sum == 3 && !this.isOutOfRange(newNode)) {
          if (nodes[JSON.stringify(pos)].includes(JSON.stringify(newNode))) {
            continue;
          }
          this.addEdge(newNode, pos);
          // Recursively get moves from each square accessible by the knight
          this.allMoves(newNode, target);
        }
      }
    }
    return;
  }

  knightMoves(src, dest) {
    // Draw the graph of moves from each square
    this.allMoves(src, dest);
    src = JSON.stringify(src);
    dest = JSON.stringify(dest);
    let queue = [];
    // The resulting shortest path
    let paths = [];
    let visited = [];
    queue.push([src, [src]]);
    // Loop until we find the path
    while (queue.length) {
      // Keep track of each square's path
      let [current, path] = queue.shift();
      // Check if already visited
      if (visited.includes(current)) continue;

      // Check if it's the desired square
      if (current == dest) {
        paths.push(path);
        break;
      }
      visited.push(current);

      // Add neighbors to queue with their paths
      let size = this.nodes[current].length;
      for (let i = 0; i < size; i++) {
        if (!visited.includes(this.nodes[current][i])) {
          // The new path is basically the old path added to the neighbor itself
          queue.push([
            this.nodes[current][i],
            [...path, this.nodes[current][i]],
          ]);
        }
      }
    }
    return paths[0];
  }
  // Check if position is out of board
  isOutOfRange(pos) {
    if (pos[0] > 7 || pos[0] < 0 || pos[1] > 7 || pos[1] < 0) {
      return true;
    }
    return false;
  }
}
