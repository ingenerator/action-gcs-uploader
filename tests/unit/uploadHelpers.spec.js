const uploadHelpers = require('../../src/uploadHelpers.js')

const stubActionOptions = (customOptions) => {
    return {
        cacheControl:      'private',
        searchBaseDir:     '/search/root',
        destinationPrefix: '',
        gzipExtensions:    [],
        ...customOptions
    }
}

describe('uploadHelpers', () => {
    describe('buildUploadOptions', () => {
        const gzipCases = [
            {
                localFile:      'my/photo.png',
                gzipExtensions: ['css', 'js'],
                expectGzip:     false,
            },
            {
                localFile:      'my/styles.css',
                gzipExtensions: ['css', 'js'],
                expectGzip:     true,
            },
            {
                localFile:      'my/styles.png.css',
                gzipExtensions: ['css', 'js'],
                expectGzip:     true,
            },
            {
                localFile:      'my/photo.css.png',
                gzipExtensions: ['css', 'js'],
                expectGzip:     false,
            },
            {
                localFile:      'styles.css',
                gzipExtensions: [],
                expectGzip:     false,
            },
            {
                localFile:      'styles',
                gzipExtensions: ['css'],
                expectGzip:     false,
            },
        ]

        it.each(gzipCases)(
            'sets gzip encoding based on file extension (%j)',
            ({localFile, gzipExtensions, expectGzip}) => {
                const opts = stubActionOptions({gzipExtensions});
                const result = uploadHelpers.buildUploadOptions(opts, '/search/root/' + localFile);

                expect(result.gzip).toBe(expectGzip);
            }
        )

        it('sets cache control based on the options', () => {
            const opts = stubActionOptions({cacheControl: 'public, max-age=lots'});
            const result = uploadHelpers.buildUploadOptions(opts, '/search/root/something');

            expect(result.metadata).toStrictEqual({cacheControl: 'public, max-age=lots'})
        })

        const pathCases = [
            {
                destinationPrefix: '',
                localFile:         '/search/root/somefile.png',
                expectPath:        'somefile.png'
            },
            {
                destinationPrefix: '',
                localFile:         '/search/root/my/somefile.png',
                expectPath:        'my/somefile.png'
            },
            {
                destinationPrefix: 'some/deep/nested/path',
                localFile:         '/search/root/my/somefile.png',
                expectPath:        'some/deep/nested/path/my/somefile.png'
            },
        ]

        it.each(pathCases)('calculates remote path %j', ({destinationPrefix, localFile, expectPath}) => {
            const opts = stubActionOptions(
                {
                    searchBaseDir: '/search/root',
                    destinationPrefix
                }
            )
            const result = uploadHelpers.buildUploadOptions(opts, localFile);
            expect(result.destination).toBe(expectPath);
        })
    })

})
