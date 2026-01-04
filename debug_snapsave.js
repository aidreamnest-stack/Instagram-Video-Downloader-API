const snapsave = require('./snapsave-downloader/src/index');
const fs = require('fs');

async function test() {
    try {
        const url = 'https://www.instagram.com/reel/DS8xsilk4sz/';
        console.log(`Testing downloader with: ${url}`);
        const result = await snapsave(url);
        fs.writeFileSync('debug_output.txt', `Success:\n${JSON.stringify(result, null, 2)}`);
    } catch (err) {
        fs.writeFileSync('debug_output.txt', `Error:\n${err.message}\n${err.stack}`);
    }
}

test();
