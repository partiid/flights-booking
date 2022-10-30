import * as _ from 'lodash';
export class Graph {
    adjecencyList: Map<number, number[]>;
    searchResult: number[];
    paths: number[][];


    constructor() {
        this.adjecencyList = new Map();
        this.searchResult = [];
        this.paths = [];


    }

    public addNode(airport: number) {
        this.adjecencyList.set(airport, []);
    }

    public addEdge(departure: number, destination: number) {

        this.adjecencyList.get(departure).push(destination);
        this.adjecencyList.get(destination).push(departure);
    }

    public bfs(start: number) {
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
    public dfs(start: number, desired_destination: number, visited = new Set()): number[] {
        console.log("start: ", start);
        this.searchResult.push(start);

        visited.add(start);
        const destinations = this.adjecencyList.get(start);
        for (let destination of destinations) {
            if (destination === desired_destination) {
                return;
            }
            if (!visited.has(destination)) {
                this.dfs(destination, desired_destination, visited);
            }
        }
    }

    //write a function to get a vertices count 
    public getNodeCount(): number {
        return this.adjecencyList.size;

    }

    public findPaths(departure: number, destination: number) {
        const nodeCount: number = this.getNodeCount();

        let isVisited: Array<boolean> = new Array(nodeCount);
        let result = [];
        for (let i = 0; i < nodeCount; i++) {
            isVisited[i] = false;

            let pathList: Array<number> = [];

            pathList.push(departure);

            this.printAllPathsUntil(departure, destination, isVisited, pathList, result);

        }


    }
    public getPaths() {
        return _.uniqWith(this.paths, _.isEqual);
    }

    public printAllPathsUntil(departure: number, destination: number, isVisited: boolean[], localPathList: number[], result: number[]): void {

        if (departure == (destination)) {
            //console.log(localPathList);
            result = result.concat(localPathList);
            this.paths.push(result);
            return;
        }

        isVisited[departure] = true;

        for (let i = 0; i < this.adjecencyList.get(departure).length; i++) {
            if (!isVisited[this.adjecencyList.get(departure)[i]]) {

                localPathList.push(this.adjecencyList.get(departure)[i]);

                this.printAllPathsUntil(this.adjecencyList.get(departure)[i], destination, isVisited, localPathList, result);

                localPathList.splice(localPathList.indexOf(this.adjecencyList.get(departure)[i]), 1);

            }
        }
        isVisited[departure] = false;

    }
    public getSearchResult() {
        return this.searchResult;
    }

    public clearSearchResult() {
        this.searchResult = [];
    }
    public getAdjecencyList() {
        return this.adjecencyList;
    }


}