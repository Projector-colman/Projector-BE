topologicalSort = (graph) => {
    let roots = []
    let sortedElements = [];
    let isCyclic = false;
    let nodes = Object.keys(graph);

    // Find roots
    nodes.forEach(node => {
        if(graph[node].blockedBy.length == 0) {
            roots.push(node);
        }
    })

    while (roots.length > 0) {
        let n = +roots.pop();
        sortedElements.push(n);
        graph[n].blocking.forEach(m => {
            // Remove vertice (each node saves the vertice)
            graph[n].blocking.splice(graph[n].blocking.indexOf(m), 1)
            graph[m].blockedBy.splice(graph[m].blockedBy.indexOf(n), 1)
            if(graph[m].blockedBy.length == 0) {
                roots.push(m);
            }
        });
    }
    
    nodes.forEach(node => {
        // if there are still vertices then theres a cycle
        if(graph[node].blockedBy.length > 0 || graph[node].blocking.length > 0) {
            isCyclic = true;
        }
    });

    if(isCyclic) {
        return [];
    } else {
        return sortedElements;
    }
};

findSubGraphs = (graph) => {
    let nodes = Object.keys(graph);
    let Q = [];
    let subGraphs = [];
    let subGraphIndex = 0;

    while (nodes.length > 0) {
        subGraphs.push([]);
        let v = nodes.pop();
        Q.push(v);
        subGraphs[subGraphIndex].push(+v);
        while(Q.length > 0) {
            let w = Q.shift();
            let neighbors = graph[w].blocking;
            neighbors = insertUnique(neighbors, graph[w].blockedBy)
            neighbors.forEach(x => {
                if(subGraphs[subGraphIndex].indexOf(+x) < 0) {
                    nodes.splice(nodes.indexOf(x), 1);
                    subGraphs[subGraphIndex].push(+x);
                    Q.push(x);
                }
            });
        }
        subGraphIndex++;
    }
    return subGraphs;
}

insertUnique = (stack, toInsert) => {
    if(toInsert.length > 0) {
        toInsert.forEach(insertee => {
            if(stack.indexOf(insertee) == -1) {
                stack.push(insertee);
            }
        })
    }
    return stack;
}

module.exports.topologicalSort = topologicalSort;
module.exports.findSubGraphs = findSubGraphs;