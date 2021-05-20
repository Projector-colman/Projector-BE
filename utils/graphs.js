const _ = require('lodash');

topologicalSort = (graph) => {
    let copyGraph = _.cloneDeep(graph);

    let roots = []
    let sortedElements = [];
    let isCyclic = false;
    let nodes = Object.keys(copyGraph);

    // Find roots
    nodes.forEach(node => {
        if(copyGraph[node].blockedBy.length == 0) {
            roots.push(node);
        }
    })

    while (roots.length > 0) {
        let n = +roots.pop();
        sortedElements.push(n);
        copyGraph[n].blocking.forEach(m => {
            // Remove vertice (each node saves the vertice)
            copyGraph[n].blocking.splice(copyGraph[n].blocking.indexOf(m), 1)
            copyGraph[m].blockedBy.splice(copyGraph[m].blockedBy.indexOf(n), 1)
            if(copyGraph[m].blockedBy.length == 0) {
                roots.push(m);
            }
        });
    }
    
    nodes.forEach(node => {
        // if there are still vertices then theres a cycle
        if(copyGraph[node].blockedBy.length > 0 || copyGraph[node].blocking.length > 0) {
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
            let neighbors = graph[w].blocking.slice(); // slice is to copy by val instead of by ref
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

issueIdtoIssueObject = (graph, ids) => {
    let fullGraph = {}
    ids.forEach(id => {
        fullGraph[id] = graph[id];
    });

    return fullGraph;
}

getGraphClustersValue = (graph) => {
    let sortedSubGraphs = [];
    let sortedGraph = [];
    let issuesClusterDetails = [];

    // Finding all clusters of blocking issues
    // Topologicaly sorting all issue clusters
    findSubGraphs(graph).forEach(graphIndexes => {
        let fullGraph = issueIdtoIssueObject(graph, graphIndexes);
        sortedSubGraphs.push(topologicalSort(fullGraph));
    });

    // Building the graph from the sorted issues indexes
    sortedSubGraphs.forEach(graphIndexes => {
        sortedGraph.push(issueIdtoIssueObject(graph, graphIndexes));
    });

    sortedGraph.forEach((issuesCluster, i) => {
        let clusterCost = 0;
        let clusterValue = 0;
        let issuesID = Object.keys(issuesCluster);
        let issuesDetails = [];
        issuesID.forEach(issueId => {
            issuesDetails.push({id: issueId, points: issuesCluster[issueId].cost})
            // Add the issue const
            clusterValue += issuesCluster[issueId].priority;
            clusterCost += issuesCluster[issueId].cost;
            // Add the issue Blockers cost times the status multiplier 
            // to-do : 1.2, done 1.5
            issuesCluster[issueId].blockedBy.forEach(blocker => {
                if(issuesCluster[blocker].status == 'done') {
                    // Add cost to cluster
                    clusterValue += (issuesCluster[blocker].priority * 1.2);
                } else {
                    clusterValue += (issuesCluster[blocker].priority);
                }
            });
        });
        issuesClusterDetails.push({details: issuesDetails, value : clusterValue / clusterCost});
    });
    return issuesClusterDetails;
}

findHighestValueCluster = (issuesCluster) => {
    let highestCluster = issuesCluster[0];
    
    issuesCluster.forEach(cluster => {
        if(cluster.value > highestCluster.value) {
            highestCluster = cluster;
        }
    });
    issuesCluster.splice(issuesCluster.indexOf(highestCluster),1); // remove cluster
    return highestCluster;
}

module.exports.topologicalSort = topologicalSort;
module.exports.findSubGraphs = findSubGraphs;
module.exports.issueIdtoIssueObject = issueIdtoIssueObject;
module.exports.getGraphClustersValue = getGraphClustersValue;
module.exports.findHighestValueCluster = findHighestValueCluster;