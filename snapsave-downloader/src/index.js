const axios = require("axios");

const downloadInstagram = async (url) => {
    try {
        console.log("Fetching from Cobalt API for:", url);

        const response = await axios.post("https://api.cobalt.tools/api/json", {
            url: url,
            vCodec: "h264",
            vQuality: "1080",
            aFormat: "mp3",
            filenamePattern: "classic",
            isAudioOnly: false,
            isTikWatermarkDisabled: true,
            isTTSMuted: false,
            dubLang: false,
            disableMetadata: false,
            twitterGif: true,
            tiktokH265: false
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        const data = response.data;

        if (data.status === "error") {
            throw new Error(data.text || "Cobalt API returned an error");
        }

        // Cobalt returns 'url' in the response for the video/image
        if (data.url) {
            return data.url;
        } else if (data.picker && data.picker.length > 0) {
            // Handle picker (multiple items), just return the first one for now or handle accordingly
            return data.picker[0].url;
        }

        throw new Error("No media URL found in Cobalt response");

    } catch (e) {
        console.error("Cobalt API Error:", e.message);
        throw e;
    }
};

module.exports = downloadInstagram;
