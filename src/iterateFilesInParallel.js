const worker = async (iterator, callback) => {
    let doneCount = 0;
    let next = await iterator.next();
    do {
        if (next.value !== undefined) {
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
