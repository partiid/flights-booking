import cluster from 'cluster';
export class Tools {

    static killFunction(fn, delay) {
        if (cluster.isPrimary) {
            const fn = cluster.fork();
            setTimeout(_ => fn.process.kill(), delay);
            console.log('Killed process ' + fn.process.pid + ' after ' + delay + 'ms');
        } else {
            fn();
        }
    }

    static getCycle(G, n, path) {
        if (path.includes(n)) {
            throw `cycle ${path.slice(path.indexOf(n)).concat(n).join('<-')}`
        }
        path.push(n)
        return G[n].forEach(next => this.getCycle(G, next, path.slice(0)))
    }
    static validateGraph(G) {
        Object.keys(G).forEach(n => this.getCycle(G, n, []))
    }
}