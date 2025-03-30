const graph = {
    Arad: { Zerind: 75, Sibiu: 140, Timisoara: 118 },
    Zerind: { Arad: 75, Oradea: 71 },
    Oradea: { Zerind: 71, Sibiu: 151 },
    Sibiu: { Arad: 140, Oradea: 151, Fagaras: 99, RimnicuVilcea: 80 },
    Timisoara: { Arad: 118, Lugoj: 111 },
    Lugoj: { Timisoara: 111, Mehadia: 70 },
    Mehadia: { Lugoj: 70, Drobeta: 75 },
    Drobeta: { Mehadia: 75, Craiova: 120 },
    Craiova: { Drobeta: 120, RimnicuVilcea: 146, Pitesti: 138 },
    RimnicuVilcea: { Sibiu: 80, Craiova: 146, Pitesti: 97 },
    Fagaras: { Sibiu: 99, Bucharest: 211 },
    Pitesti: { RimnicuVilcea: 97, Craiova: 138, Bucharest: 101 },
    Bucharest: { Fagaras: 211, Pitesti: 101, Giurgiu: 90, Urziceni: 85 },
    Giurgiu: { Bucharest: 90 },
    Urziceni: { Bucharest: 85, Hirsova: 98, Vaslui: 142 },
    Hirsova: { Urziceni: 98, Eforie: 86 },
    Eforie: { Hirsova: 86 },
    Vaslui: { Urziceni: 142, Iasi: 92 },
    Iasi: { Vaslui: 92, Neamt: 87 },
    Neamt: { Iasi: 87 }
  };
  

  function validCity(start, end) {
    if (!graph[start] || !graph[end]) {
      alert("Cidade de partida ou chegada inválida. Verifique os nomes.");
      return false;
    }
    return true;
  }

function calculateTotalCost(path) {
  if (!path || path.length < 2) return 0;
  
  let totalCost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];
    totalCost += graph[current][next];
  }
  return totalCost;
}
  
  function uniformCostSearch(start, end) {
    const queue = [[start, 0, [start]]]; 
    const visited = new Set();
  
    while (queue.length > 0) {
      queue.sort((a, b) => a[1] - b[1]); 
      const [node, cost, path] = queue.shift();
  
      if (node === end) {
        return {
          path: path,
          cost: cost
        };
      }
  
      if (!visited.has(node)) {
        visited.add(node);
        for (const neighbor in graph[node]) {
          const newCost = cost + graph[node][neighbor];
          const newPath = [...path, neighbor];
          queue.push([neighbor, newCost, newPath]);
        }
      }
    }
    return null;
  }

function depthLimitedSearch(start, end, limit, path = [], visited = new Set(), cost = 0) {
  path.push(start);

  if (start === end) return {path: [...path], cost}; 
  if (limit <= 0) return null; 
  visited.add(start);

  for (const neighbor in graph[start]) {
    if (!visited.has(neighbor)) {
      const result = depthLimitedSearch(neighbor, end, limit - 1, path, visited, cost + graph[start][neighbor]);
      if (result) return result; 
    }
  }

  path.pop(); 
  return null;
}

  function breadthFirstSearch(start, end) {
    const queue = [[start, [start]]]; 
    const visited = new Set();
  
    while (queue.length > 0) {
      const [node, path] = queue.shift();
  
      if (node === end) {
        return {
          path: path,
          cost: calculateTotalCost(path)
        };
      }
  
      if (!visited.has(node)) {
        visited.add(node);
        for (const neighbor in graph[node]) {
          if (!visited.has(neighbor)) {
            queue.push([neighbor, [...path, neighbor]]);
          }
        }
      }
    }
    return null;
  }
  
  function depthFirstSearch(start, end, path = [], visited = new Set(), cost = 0) {
    path.push(start);
    if (start === end) return {path: [...path], cost};

    visited.add(start);
  
    
    for (const neighbor in graph[start]) {
      if (!visited.has(neighbor)) {
        const result = depthFirstSearch(neighbor, end, path, visited, cost + graph[start][neighbor]);
        if (result) return result;
      }
    }
    path.pop();
    return null;
  }

function iterativeDeepeningSearch(start, end, maxDepth) {
  for (let depth = 0; depth <= maxDepth; depth++) {
      const result = depthLimitedSearch(start, end, depth);
      if (result) return result;
  }
  return null;
}

function greedyBestFirstSearch(start, end) {
  const queue = [[start, [start]]]; 
  const visited = new Set();

  while (queue.length > 0) {
    queue.sort((a, b) => heuristic(a[0], end) - heuristic(b[0], end));
    const [node, path] = queue.shift();

    if (node === end) {
      return {
        path: path,
        cost: calculateTotalCost(path)
      };
    }

    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor in graph[node]) {
        if (!visited.has(neighbor)) {
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }
  }
  return null;
}

  
  function aStar(start, end) {
    if (!validCity(start, end)) return null;

    const openSet = new Set([start]);
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    for (const node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    }
    gScore[start] = 0;
    fScore[start] = heuristic(start, end);

    while (openSet.size > 0) {
        let current = [...openSet].reduce((a, b) => fScore[a] < fScore[b] ? a : b);

        if (current === end) {
          const path = reconstructPath(cameFrom, current);
          return {path, cost: gScore[current]};
        }

        openSet.delete(current);

        for (const neighbor in graph[current]) {
            const tentativeGScore = gScore[current] + graph[current][neighbor];

            if (tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);

                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }
    }
    return null;
}

  
function heuristic(a, b) {
    const heuristicValues = {
      Arad: 6,
      Zerind: 5,
      Oradea: 4,
      Sibiu: 3,
      Timisoara: 5,
      Lugoj: 4,
      Mehadia: 3,
      Drobeta: 2,
      Craiova: 1,
      RimnicuVilcea: 2,
      Fagaras: 1,
      Pitesti: 1,
      Bucharest: 0,
      Giurgiu: 1,
      Urziceni: 1,
      Hirsova: 2,
      Eforie: 3,
      Vaslui: 2,
      Iasi: 1,
      Neamt: 2
    };
    return heuristicValues[a] || 0;
  }

  function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[current]) {
      current = cameFrom[current];
      if (path.includes(current)) {
        console.error("Loop detectado no caminho.");
        return null;
      }
      path.unshift(current);
    }
    return path;
  }
  
function displayResult(result) {
  if (!result) {
    document.getElementById('result').textContent = "Caminho não encontrado";
    document.getElementById('cost').textContent = "";
    return;
  }
  
  document.getElementById('result').textContent = result.path.join(' -> ');
  document.getElementById('cost').textContent = `Custo total: ${result.cost} km`;
}

function runBreadthFirstSearch() {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const result = breadthFirstSearch(start, end);
  displayResult(result);
}

function runDepthFirstSearch() {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const result = depthFirstSearch(start, end);
  displayResult(result);
}

function runUniformCostSearch() {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const result = uniformCostSearch(start, end);
  displayResult(result);
}

function runDepthLimitedSearch() {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const limit = parseInt(prompt("Digite o limite de profundidade:"), 10) || 3;
  const result = depthLimitedSearch(start, end, limit);
  displayResult(result);
}

function runIterativeDeepeningSearch() {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const maxDepth = parseInt(prompt("Digite o limite máximo de profundidade:"), 10) || 10;
  const result = iterativeDeepeningSearch(start, end, maxDepth);
  displayResult(result);
}

function runGreedy() {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const result = greedyBestFirstSearch(start, end);
  displayResult(result);
}

function runAStar() {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const result = aStar(start, end);
  displayResult(result);
}