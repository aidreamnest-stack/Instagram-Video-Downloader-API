// DOM Elements
const urlInput = document.getElementById('urlInput');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const resultsState = document.getElementById('resultsState');
const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');
const downloadLinks = document.getElementById('downloadLinks');

// State
let currentUrl = '';

// Initialize
init();

function init() {
    // Event listeners
    clearBtn.addEventListener('click', handleClear);
    downloadBtn.addEventListener('click', handleDownload);
    retryBtn.addEventListener('click', handleRetry);
    urlInput.addEventListener('input', handleInputChange);
    urlInput.addEventListener('keypress', handleKeyPress);

    // Auto-paste from clipboard on focus
    urlInput.addEventListener('focus', async () => {
        if (urlInput.value === '') {
            try {
                const text = await navigator.clipboard.readText();
                const trimmedText = text.trim(); // FIX: Trim whitespace
                if (isInstagramUrl(trimmedText)) {
                    urlInput.value = trimmedText;
                    urlInput.dispatchEvent(new Event('input'));
                }
            } catch (err) {
                // Clipboard permission denied or not available
            }
        }
    });
}

function handleInputChange() {
    const hasValue = urlInput.value.trim().length > 0;
    downloadBtn.disabled = !hasValue;

    // Hide states when typing
    hideAllStates();
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !downloadBtn.disabled) {
        handleDownload();
    }
}

function handleClear() {
    urlInput.value = '';
    urlInput.focus();
    downloadBtn.disabled = true;
    hideAllStates();
}

function handleRetry() {
    hideAllStates();
    urlInput.focus();
}

async function handleDownload() {
    const url = urlInput.value.trim();

    // Validate URL
    if (!url) {
        showError('Please enter an Instagram URL');
        return;
    }

    if (!isInstagramUrl(url)) {
        showError('Please enter a valid Instagram URL');
        return;
    }

    currentUrl = url;

    // Show loading
    hideAllStates();
    loadingState.classList.remove('hidden');
    downloadBtn.disabled = true;

    try {
        // Call API
        const response = await fetch(`/igdl?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch download links');
        }

        // Show results
        displayResults(data);

    } catch (error) {
        console.error('Download error:', error);
        showError(error.message || 'Failed to download. Please try again.');
    } finally {
        loadingState.classList.add('hidden');
        downloadBtn.disabled = false;
    }
}

function isInstagramUrl(url) {
    // Updated regex to support both /reel/ and /reels/ (singular and plural)
    const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reels?|tv|stories)\//i;
    return instagramRegex.test(url);
}

function hideAllStates() {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    resultsState.classList.add('hidden');
}

function showError(message) {
    hideAllStates();
    errorText.textContent = message;
    errorState.classList.remove('hidden');
}

function displayResults(data) {
    hideAllStates();
    downloadLinks.innerHTML = '';

    // Handle different response formats
    let links = [];

    if (data.url) {
        // Single URL response
        if (typeof data.url === 'string') {
            links = [{ url: data.url, quality: 'Video' }];
        } else if (Array.isArray(data.url)) {
            links = data.url.map((url, index) => ({
                url: typeof url === 'string' ? url : url.url,
                quality: `Video ${index + 1}`
            }));
        }
    } else if (data.data && Array.isArray(data.data)) {
        // Array of download options
        links = data.data.map((item, index) => ({
            url: item.url,
            quality: item.quality || item.type || `Option ${index + 1}`
        }));
    } else {
        showError('No download links found');
        return;
    }

    if (links.length === 0) {
        showError('No download links available');
        return;
    }

    // Create download link elements
    links.forEach((link, index) => {
        const linkElement = createDownloadLinkElement(link, index);
        downloadLinks.appendChild(linkElement);
    });

    resultsState.classList.remove('hidden');
}

function createDownloadLinkElement(linkData, index) {
    const div = document.createElement('div');
    div.className = 'download-link';
    div.style.animationDelay = `${index * 0.1}s`;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'link-info';

    const qualitySpan = document.createElement('span');
    qualitySpan.className = 'link-quality';
    qualitySpan.textContent = linkData.quality || 'Download';

    infoDiv.appendChild(qualitySpan);

    const downloadButton = document.createElement('a');
    downloadButton.href = linkData.url;
    downloadButton.target = '_blank';
    downloadButton.rel = 'noopener noreferrer';
    downloadButton.download = '';
    downloadButton.className = 'link-icon';
    downloadButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V16M12 16L16 12M12 16L8 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 16V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    `;

    div.appendChild(infoDiv);
    div.appendChild(downloadButton);

    // Add click handler for direct download
    div.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            window.open(linkData.url, '_blank');
        }
    });

    return div;
}

// Utility: Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

// Add smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation class when elements come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.feature, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
