const path = require('path');

function shouldGzip(gzipExtensions, fileName) {
    const extension = path.extname(fileName).substring(1);
    return gzipExtensions.includes(extension)
}

function buildUploadOptions(actionOptions, localFile) {
    const relativePath = path.relative(actionOptions.searchBaseDir, localFile);
    const destinationPath = path.join(actionOptions.destinationPrefix, relativePath);
    return {
        destination: destinationPath,
        gzip:        shouldGzip(actionOptions.gzipExtensions, localFile),
        metadata:    {
            cacheControl: actionOptions.cacheControl
        }
    }
}

module.exports = {
    buildUploadOptions
}
