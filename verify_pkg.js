const snapsave = require('./snapsave-downloader/src/index');

async function test() {
    try {
        const url = 'https://www.instagram.com/reel/DS8xsilk4sz/';
        console.log(`Testing downloader with: ${url}`);
        const result = await snapsave(url);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
