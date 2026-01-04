const ndl = require('ness-downloader');

async function test() {
    try {
        const url = 'https://www.instagram.com/reel/DS8xsilk4sz/';
        console.log(`Testing downloader with: ${url}`);

        // Attempting generic usage based on common patterns
        // If this fails, I will adjust based on search results/inspection
        const result = await ndl.Social(url);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
