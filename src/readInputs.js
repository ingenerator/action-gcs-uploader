const core = require('@actions/core');
const path = require('path');

function parseDestination(destination) {
    let bucketName = destination;
    let prefix = '';
    const idx = destination.indexOf('/');

    if (idx > -1) {
        bucketName = destination.substring(0, idx);
        prefix = destination.substring(idx + 1);
    }
    return {
        bucket: bucketName,
        prefix: prefix
    }
}

module.exports = (githubWorkspace) => {
    const destination = parseDestination(core.getInput('destination', {required: true}));
    const sourceDirectory = core.getInput('source-directory', {required: true});

    return {
        searchBaseDir:     path.join(githubWorkspace, sourceDirectory),
        sources:           core.getInput('sources', {required: true}),
        cacheControl:      core.getInput('cache-control', {required: true}),
        destinationBucket: destination.bucket,
        destinationPrefix: destination.prefix,
        credentials:       core.getInput('credentials', {required: true}),
        parallelUploads:   core.getInput('max-parallel', {required: true}),
        gzipExtensions:    core.getInput('gzip-extensions', {required: true}).split(',')
    }
}
