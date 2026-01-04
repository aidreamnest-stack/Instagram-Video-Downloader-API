const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("querystring"); // Using built-in querystring or just URLSearchParams

// --- UTILS ---
const instagramRegex = /^https?:\/\/(?:www\.)?instagram\.com\/(?:[^/]+\/)?(?:p|reel|reels|tv|stories|share)\/([^/?#&]+).*/g;
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36";

const normalizeURL = (url) => {
    if (url.match(instagramRegex)) url = url.replace(/\?.*$/, "");
    return /^(https?:\/\/)(?!www\.)[a-z0-9]+/i.test(url) ? url.replace(/^(https?:\/\/)([^./]+\.[^./]+)(\/.*)?$/, "$1www.$2$3") : url;
};

// --- DECRYPTER ---
function decodeSnapApp(args) {
    let [h, u, n, t, e, r] = args;
    const tNum = Number(t);
    const eNum = Number(e);

    function decode(d, e, f) {
        const g = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
        const hArr = g.slice(0, e);
        const iArr = g.slice(0, f);
        let j = d.split("").reverse().reduce((a, b, c) => {
            const idx = hArr.indexOf(b);
            if (idx !== -1) return a + idx * (Math.pow(e, c));
            return a;
        }, 0);
        let k = "";
        while (j > 0) {
            k = iArr[j % f] + k;
            j = Math.floor(j / f);
        }
        return k || "0";
    }

    let result = "";
    for (let i = 0, len = h.length; i < len;) {
        let s = "";
        while (i < len && h[i] !== n[eNum]) {
            s += h[i];
            i++;
        }
        i++; // skip delimiter
        for (let j = 0; j < n.length; j++)
            s = s.replace(new RegExp(n[j], "g"), j.toString());
        result += String.fromCharCode(Number(decode(s, eNum, 10)) - tNum);
    }

    const fixEncoding = (str) => {
        try {
            const bytes = new Uint8Array(str.split("").map(char => char.charCodeAt(0)));
            return new TextDecoder("utf-8").decode(bytes);
        } catch (e) {
            return str;
        }
    };

    return fixEncoding(result);
}

function getEncodedSnapApp(data) {
    return data.split("decodeURIComponent(escape(r))}(")[1]
        .split("))")[0]
        .split(",")
        .map(v => v.replace(/"/g, "").trim());
}

function getDecodedSnapSave(data) {
    const errorMessage = data?.split("document.querySelector(\"#alert\").innerHTML = \"")?.[1]?.split("\";")?.[0]?.trim();
    if (errorMessage) throw new Error(errorMessage);
    return data.split("getElementById(\"download-section\").innerHTML = \"")[1]
        .split("\"; document.getElementById(\"inputData\").remove(); ")[0]
        .replace(/\\(\\)?/g, "");
}

function decryptSnapSave(data) {
    return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)));
}

// --- MAIN ---
const snapsave = async (url) => {
    try {
        const UA = userAgent;
        const normalizedUrl = normalizeURL(url);

        // Not checking validates deeply, just proceeding manually

        const params = new URLSearchParams();
        params.append("url", normalizedUrl);

        console.log("Fetching from SnapSave for:", normalizedUrl);

        const response = await axios.post("https://snapsave.app/action.php?lang=en", params, {
            headers: {
                "accept": "*/*",
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://snapsave.app",
                "referer": "https://snapsave.app/",
                "user-agent": UA
            },
            responseType: "text" // Important to get raw HTML/text
        });

        const html = response.data;
        // console.log("Response HTML length:", html.length);

        const decode = decryptSnapSave(html);
        const $ = cheerio.load(decode);

        const media = [];

        if ($("table.table").length) {
            $("tbody > tr").each((_, el) => {
                const $el = $(el);
                const $td = $el.find("td");
                const resolution = $td.eq(0).text().trim();
                let _url = $td.eq(2).find("a").attr("href") || $td.eq(2).find("button").attr("onclick");

                // Handle potential progressApi render logic
                const shouldRender = /get_progressApi/ig.test(_url || "");
                if (shouldRender) {
                    const match = /get_progressApi\('(.*?)'\)/.exec(_url || "");
                    if (match && match[1]) {
                        _url = "https://snapsave.app" + match[1]; // simplified expectation
                        // Note: The original code fetched this URL to get the actual link.
                        // But often it just returns the file or a redirect.
                        // For now, let's just return what we find. 
                    }
                }

                if (_url && resolution) {
                    media.push({ resolution, url: _url });
                }
            });
        }

        // The original API wrapper in index.js expected a single URL string directly or handled an object.
        // req.query.url -> snapsave(url) -> downloadedURL
        // res.json({ url: downloadedURL })

        // We should return the best quality URL string.
        if (media.length > 0) {
            // Find 1080p or the first one
            const best = media.find(m => m.resolution.includes("1080")) || media[0];
            return best.url;
        } else {
            // Try other selectors from the source code if table failed
            const downloadBtn = $("a.btn-download").attr("href");
            if (downloadBtn) return downloadBtn;
        }

        console.error("No media found in decoded content");
        return null;

    } catch (e) {
        console.error("SnapSave Error:", e.message);
        throw e;
    }
};

module.exports = snapsave;
