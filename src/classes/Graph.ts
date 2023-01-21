import { Console } from 'console';
import * as _ from 'lodash';
import { Tools } from './Tools';
export class Graph {
    public adjecencyList: Map<number, number[]>;
    searchResult;
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




        visited.add(start);
        const destinations = this.adjecencyList.get(start);
        if (destinations.includes(desired_destination)) {
            this.searchResult.push(start);
        }

        for (let destination of destinations) {

            if (destination === desired_destination) {
                console.log("Found destination: ", destination);
                console.log("Visited: ", [...visited]);

                return;
            }
            if (!visited.has(destination)) {
                this.dfs(destination, desired_destination, visited);

            }
        }
    }

    public dfsModified(start: number, desired_destination: number, visited = new Set(), nodeVisitCount = new Map()) {

        visited.add(start);

        if (!nodeVisitCount.has(start)) {
            nodeVisitCount.set(start, 1);
        }
        //check if the node has been visited more than 2 times, if so then we need to break the loop
        if (nodeVisitCount.get(start) > 1) {
            //set the start node to last visited node to traverse to the neigbour if they exist

            //get next element in map

            //get index of current key 
            let index = Object.keys(this.getAdjecencyListObject()).indexOf(start.toString());
            //get next key
            let nextKey = Object.keys(this.getAdjecencyListObject())[index + 1];
            start = parseInt(nextKey);

        }

        const destinations = this.adjecencyList.get(start);
        for (let destination of destinations) {
            if (destination === desired_destination) {

                console.log("Found destination: ", destination);
                console.log("Visited: ", [...visited]);
                return;
            }
            if (!visited.has(destination)) {
                this.dfsModified(destination, desired_destination, visited, nodeVisitCount);
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

        let pathList: Array<number> = [];
        // console.log("iteration: ", i);
        pathList.push(departure);


        this.printAllPathsUntil(departure, destination, isVisited, pathList);



    }

    public getPaths() {
        //return array of unique arrays




        return _.uniqWith(this.paths, _.isEqual);
    }

    public printAllPathsUntil(departure: number, destination: number, isVisited: boolean[], localPathList: number[]) {
        //increment route search try count to break the loop if no more routes are available

        isVisited[departure] = true;

        if (departure == (destination)) {


            this.paths.push([...localPathList]);
            console.log("🚀 ~ file: Graph.ts:137 ~ Graph ~ printAllPathsUntil ~ Route found: ", localPathList);

            //console.log("🚀 ~ file: Graph.ts:137 ~ Graph ~ printAllPathsUntil ~ Route found: ", result)
            isVisited[departure] = false;
            //console.log("Route found: ", result, "Route length: ", result.length);
            return;

        }



        for (let i = 0; i < this.adjecencyList.get(departure).length; i++) {

            if (!isVisited[i]) {

                //if (_.isEmpty(result) && this.tries <= this.getNodeCount()) {


                localPathList.push(this.adjecencyList.get(departure)[i]);
                this.printAllPathsUntil(this.adjecencyList.get(departure)[i], destination, isVisited, localPathList);
                localPathList.splice(localPathList.indexOf(this.adjecencyList.get(departure)[i]), 1);

                // } else {
                //     break;
                // }


            }

        }

        isVisited[departure] = false;

    }
    public getCycle(G, n, path) {
        if (path.includes(n)) {
            //throw new Array(path.slice(path.indexOf(n)).concat(n));
            throw new Error(`cycle ${path.slice(path.indexOf(n)).concat(n).join('<-')}`);

        }
        path.push(n)
        return G[n].forEach(next => this.getCycle(G, next, path.slice(0)))
    }
    public validateCycle(G) {
        Object.keys(G).forEach(n => this.getCycle(G, n, []))
    }


    public getSearchResult() {
        console.log(this.searchResult);
        return this.searchResult;
    }

    public clearSearchResult() {
        this.searchResult = [];
    }
    public getAdjecencyList() {
        //console.log(this.adjecencyList);
        return [...this.adjecencyList];
    }
    public getAdjecencyListObject() {
        return Object.fromEntries(this.adjecencyList);
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