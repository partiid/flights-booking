import * as _ from 'lodash';
import { Tools } from './Tools';
export class Graph {
    public adjecencyList: Map<number, number[]>;
    searchResult: number[];
    paths: number[][];


    constructor() {
        this.adjecencyList = new Map();
        this.searchResult = [];
        this.paths = [];

    }

    public addNode(departure: number) {
        this.adjecencyList.set(departure, []);
    }

    public addEdge(departure: number, destination: number) {

        this.adjecencyList.get(departure).push(destination);
        //this.adjecencyList.get(destination).push(departure);
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
        console.log("Node Count: ", nodeCount);
        for (let i = 0; i < nodeCount; i++) {
            isVisited[i] = false;
            console.log("Iteration: ", i);
            let pathList: Array<number> = [];

            pathList.push(departure);

            //Tools.killFunction(this.printAllPathsUntil(departure, destination, isVisited, pathList, result), 1000);


        }


    }
    public getPaths() {
        return _.uniqWith(this.paths, _.isEqual());
    }

    public printAllPathsUntil(departure: number, destination: number, isVisited: boolean[], localPathList: number[], result: number[]): boolean {

        if (departure == (destination)) {
            result = result.concat(localPathList);
            this.paths.push(result);
            console.log("Paths found: ", this.paths.length);
            return;
        }
        //console.log("Paths:", this.paths);

        isVisited[departure] = true;
        if (this.paths.length < 1) {


            for (let i = 0; i < this.adjecencyList.get(departure).length; i++) {
                if (!isVisited[this.adjecencyList.get(departure)[i]]) {

                    localPathList.push(this.adjecencyList.get(departure)[i]);

                    this.printAllPathsUntil(this.adjecencyList.get(departure)[i], destination, isVisited, localPathList, result);

                    localPathList.splice(localPathList.indexOf(this.adjecencyList.get(departure)[i]), 1);

                }
                //console.log("Printing paths until: ", i);
            }
            isVisited[departure] = false;


        }


    }
    public getSearchResult() {
        return this.searchResult;
    }

    public clearSearchResult() {
        this.searchResult = [];
    }
    public getAdjecencyList() {
        //console.log(this.adjecencyList);
        return [...this.adjecencyList];
    }
    public getNode(departure: number) {
        return this.adjecencyList.get(departure);
    }
    public hasNode(departure: number) {
        return this.adjecencyList.has(departure);
    }


}