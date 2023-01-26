const fs = require('fs').promises;

const isDirectory = async (file) => {
    const stat = await fs.lstat(file);
    return stat.isDirectory();
}

const worker = async (iterator, callback) => {
    let doneCount = 0;
    let next = await iterator.next();
    do {
        if ((next.value !== undefined) && !await isDirectory(next.value)) {
            await callback(next.value);
            doneCount++;
        }
        
        next = await iterator.next();
    } while (!next.done);


    return doneCount;
}

const iterateFilesInParallel = async (iterator, parallelCount, callback) => {
    const workers = [];
    for (let i = 0; i < parallelCount; i++) {
        workers.push(worker(iterator, callback));
    }
    const workerCounts = await Promise.all(workers);

    return workerCounts.reduce((total, thisCount) => total + thisCount);
}

module.exports = iterateFilesInParallel;
