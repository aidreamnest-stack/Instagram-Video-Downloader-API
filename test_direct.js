const instagramGetUrl = require("instagram-url-direct");

async function test() {
    try {
        const url = 'https://www.instagram.com/reel/DS8xsilk4sz/';
        console.log(`Testing instagram-url-direct with: ${url}`);
        const result = await instagramGetUrl(url);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
