const downloader = require('./snapsave-downloader/src/index');

async function test() {
    try {
        const url = 'https://www.instagram.com/reel/DS8xsilk4sz/';
        console.log(`Testing Cobalt implementation with: ${url}`);
        const result = await downloader(url);
        console.log('Result:', result);
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
