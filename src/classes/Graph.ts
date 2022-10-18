export class Graph {
    adjecencyList: Map<number, number[]>;
    searchResult: number[];
    constructor() {
        this.adjecencyList = new Map();
        this.searchResult = [];
    }
    addNode(airport: number) {
        this.adjecencyList.set(airport, []);
    }

    addEdge(departure: number, destination: number) {

        this.adjecencyList.get(departure).push(destination);
        this.adjecencyList.get(destination).push(departure);
    }

    bfs(start: number) {
        let queue: number[] = [];
        let result: number[] = [];
        let visited: Map<number, boolean> = new Map();

        queue.push(start);
        visited.set(start, true);

        while (queue.length > 0) {
            let current = queue.shift();
            result.push(current);

            this.adjecencyList.get(current).forEach(neighbor => {
                if (!visited.get(neighbor)) {
                    visited.set(neighbor, true);
                    queue.push(neighbor);
                }
            })
        }

        return result;
    }
    dfs(start: number, visited = new Set()) {
        console.log("start: ", start);
        this.searchResult.push(start);

        visited.add(start);
        const destinations = this.adjecencyList.get(start);
        for (let destination of destinations) {
            if (destination === 1446) {
                return;
            }
            if (!visited.has(destination)) {
                this.dfs(destination, visited);
            }
        }


    }
    getSearchResult() {
        return this.searchResult;
    }


    getAdjecencyList() {
        return this.adjecencyList;
    }


}