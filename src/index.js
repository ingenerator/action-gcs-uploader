const core = require('@actions/core');
const {Storage} = require('@google-cloud/storage');
const glob = require('@actions/glob');
const readInputs = require('./readInputs');
const iterateFilesInParallel = require('./iterateFilesInParallel');
const {buildUploadOptions} = require('./uploadHelpers');

async function run() {
    try {
        const options = readInputs(process.cwd());
        const storage = new Storage({
            credentials: JSON.parse(options.credentials)
        });
        const bucket = storage.bucket(options.destinationBucket);

        core.info(`Initiating upload from ${options.searchBaseDir}`);

        // Github actions glob bases itself from the current working directory
        process.chdir(options.searchBaseDir);
        const globber = await glob.create(options.sources);
        const fileList = globber.globGenerator();

        const filesUploaded = await iterateFilesInParallel(fileList, options.parallelUploads, async (file) => {
            core.debug(`- Upload ${file}`)
            await bucket.upload(file, buildUploadOptions(options, file));
        });

        core.info(`Uploaded ${filesUploaded} files`);
    } catch (error) {
        core.setFailed(error);
    }
}

run();
