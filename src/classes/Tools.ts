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


}