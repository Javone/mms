var path = require('path');
var gaze = require('gaze');
var replace = require('replace');
var Promise = require('bluebird');

async function copy({ watch } = {}) {
    const ncp = Promise.promisify(require('ncp'));

    console.log("---- copy begin ----");

    await Promise.all([
        // todo
        ncp('public/static/css', 'public/build/css'),
        ncp('public/static/images', 'public/build/images'),
        ncp('public/static/js', 'public/build/js'),
        ncp('public/static/fonts', 'public/build/fonts')
    ]);

    if (watch) {
        const watcher = await new Promise((resolve, reject) => {
            // todo
            gaze('src/content/**/*.*', (err, val) => err ? reject(err) : resolve(val));
        });
        watcher.on('changed', async (file) => {
            // todo
            const relPath = file.substr(path.join(__dirname, '../src/content/').length);
            await ncp(`src/content/${relPath}`, `build/content/${relPath}`);
        });
    }
    console.log("---- copy end ----");
}

module.exports = copy;
