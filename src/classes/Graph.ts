import { Console } from 'console';
import * as _ from 'lodash';
import { Tools } from './Tools';
export class Graph {
    public adjecencyList: Map<number, number[]>;
    searchResult: number[];
    paths: number[][];
    tries: number = 0;
    found: boolean = false;

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
    public bfsv2(start: number, desired_destination: number): number[] {
        let queue: number[] = [start];
        const visited = new Set();
        while (queue.length > 0) {
            const airport = queue.shift();

            const destinations = this.adjecencyList.get(airport);

            for (let destination of destinations) {

                if (destination === desired_destination) {
                    console.log("Found destination: ", destination);

                }

                if (!visited.has(destination)) {
                    visited.add(destination);
                    queue.push(destination);
                    console.log("Destination: ", destination);
                }

            }
        }
        return _.toArray(queue);
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
            console.log("🚀 ~ file: Graph.ts:107 ~ Graph ~ findPaths ~ i", i)
            //console.log("Iteration: ", i);
            let pathList: Array<number> = [];
            console.log("iteration: ", i);
            pathList.push(departure);

            this.printAllPathsUntil(departure, destination, isVisited, pathList, result);



        }

    }

    public getPaths() {
        return _.uniqWith(this.paths, _.isEqual());
    }

    public printAllPathsUntil(departure: number, destination: number, isVisited: boolean[], localPathList: number[], result: number[]) {
        //increment route search try count to break the loop if no more routes are available
        this.tries++;
        //break the loop if no more routes are available 
        // if () {

        //     this.found = true;
        // }



        if (departure == (destination)) {

            result = result.concat(localPathList);
            //console.log("🚀 ~ file: Graph.ts:137 ~ Graph ~ printAllPathsUntil ~ Route found: ", result)
            this.paths.push(result);

            return;

        }

        isVisited[departure] = true;


        for (let i = 0; i < this.adjecencyList.get(departure).length; i++) {
            if (!isVisited[this.adjecencyList.get(departure)[i]]) {

                //if (_.isEmpty(result) && this.tries <= this.getNodeCount()) {
                if (this.tries <= 1000) {

                    localPathList.push(this.adjecencyList.get(departure)[i]);
                    this.printAllPathsUntil(this.adjecencyList.get(departure)[i], destination, isVisited, localPathList, result);
                    localPathList.splice(localPathList.indexOf(this.adjecencyList.get(departure)[i]), 1);
                } else {
                    break;
                }
                // } else {
                //     break;
                // }


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
        //console.log(this.adjecencyList);
        return [...this.adjecencyList];
    }
    public getAdjecencyListMap() {
        return this.adjecencyList;
    }
    public getNode(departure: number) {
        return this.adjecencyList.get(departure);
    }
    public hasNode(departure: number) {
        return this.adjecencyList.has(departure);
    }



}