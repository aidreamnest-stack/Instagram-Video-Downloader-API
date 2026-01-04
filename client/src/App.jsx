import { useState, useEffect } from 'react';
import './index.css';

function App() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    useEffect(() => {
        // Auto-paste from clipboard on focus if input is empty
        const handleFocus = async () => {
            if (!url) {
                try {
                    // Check if clipboard permission is available logic skipped for simplicity in browsers
                    const text = await navigator.clipboard.readText();
                    const trimmedText = text.trim();
                    if (isInstagramUrl(trimmedText)) {
                        setUrl(trimmedText);
                    }
                } catch (err) {
                    // Ignore clipboard errors
                }
            }
        };

        const inputElement = document.getElementById('urlInput');
        if (inputElement) {
            inputElement.addEventListener('focus', handleFocus);
        }

        return () => {
            if (inputElement) inputElement.removeEventListener('focus', handleFocus);
        }
    }, [url]);

    const isInstagramUrl = (url) => {
        const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reels?|tv|stories)\//i;
        return instagramRegex.test(url);
    };

    const handleClear = () => {
        setUrl('');
        setError('');
        setResults(null);
    };

    const handleDownload = async () => {
        if (!url) {
            setError('Please enter an Instagram URL');
            return;
        }

        if (!isInstagramUrl(url)) {
            setError('Please enter a valid Instagram URL');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null); // Clear previous results

        try {
            const response = await fetch(`/igdl?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch download links');
            }

            setResults(data);
        } catch (err) {
            console.error('Download error:', err);
            setError(err.message || 'Failed to download. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && url) {
            handleDownload();
        }
    };

    // Helper to parse results into displayable format
    const getDownloadLinks = (data) => {
        let links = [];
        let thumbnail = null;

        if (data.url && typeof data.url === 'object' && data.url.data && Array.isArray(data.url.data)) {
            // Snapsave nested response format
            links = data.url.data.map((item, index) => ({
                url: item.url,
                quality: item.quality || item.type || `Video ${index + 1}`,
                thumbnail: item.thumbnail
            }));
            if (links[0] && links[0].thumbnail) thumbnail = links[0].thumbnail;
        } else if (data.url) {
            // Single URL response
            if (typeof data.url === 'string') {
                links = [{ url: data.url, quality: 'Video' }];
            } else if (Array.isArray(data.url)) {
                links = data.url.map((u, index) => ({
                    url: typeof u === 'string' ? u : u.url,
                    quality: `Video ${index + 1}`
                }));
            }
        } else if (data.data && Array.isArray(data.data)) {
            // Array of download options
            links = data.data.map((item, index) => ({
                url: item.url,
                quality: item.quality || item.type || `Option ${index + 1}`,
                thumbnail: item.thumbnail
            }));
            if (links[0] && links[0].thumbnail) thumbnail = links[0].thumbnail;
        }

        return { links, thumbnail };
    };

    const renderResults = () => {
        if (!results) return null;

        const { links, thumbnail } = getDownloadLinks(results);

        if (links.length === 0) {
            // Only show error if we expected results but got none, handling handled inside parse mostly
            return (
                <div className="error-state">
                    <p className="error-text">No download links available</p>
                </div>
            )
        }

        return (
            <div className="results-state">
                <div className="success-header">
                    <svg className="success-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="22" stroke="#10B981" strokeWidth="2" />
                        <path d="M16 24L21 29L32 18" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3 className="success-title">Ready to Download!</h3>
                </div>

                {thumbnail && (
                    <div className="thumbnail-preview">
                        <img src={thumbnail} alt="Video Thumbnail" className="thumbnail-image" loading="lazy" />
                    </div>
                )}

                <div className="download-links">
                    {links.map((link, index) => (
                        <div key={index} className="download-link" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="link-info">
                                <span className="link-quality">{link.quality}</span>
                            </div>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-icon"
                                download
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3V16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 16V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="background-gradient"></div>

            <header className="header">
                <div className="container">
                    <div className="logo">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="40" rx="12" fill="url(#gradient1)" />
                            <path d="M20 14C16.69 14 14 16.69 14 20C14 23.31 16.69 26 20 26C23.31 26 26 23.31 26 20C26 16.69 23.31 14 20 14ZM20 24C17.79 24 16 22.21 16 20C16 17.79 17.79 16 20 16C22.21 16 24 17.79 24 20C24 22.21 22.21 24 20 24Z" fill="white" />
                            <path d="M26 12H14C12.9 12 12 12.9 12 14V26C12 27.1 12.9 28 14 28H26C27.1 28 28 27.1 28 26V14C28 12.9 27.1 12 26 12ZM26 26H14V14H26V26Z" fill="white" />
                            <circle cx="26.5" cy="13.5" r="1.5" fill="white" />
                            <defs>
                                <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40">
                                    <stop offset="0%" style={{ stopColor: '#833AB4' }} />
                                    <stop offset="50%" style={{ stopColor: '#FD1D1D' }} />
                                    <stop offset="100%" style={{ stopColor: '#FCB045' }} />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="logo-text">InstaGrab</span>
                    </div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <section className="hero">
                        <h1 className="hero-title">
                            Download Instagram Videos <span className="gradient-text">Instantly</span>
                        </h1>
                        <p className="hero-subtitle">
                            Fast, free, and easy-to-use Instagram video downloader.
                            Download videos, reels, and stories in high quality.
                        </p>
                    </section>

                    <section className="download-section">
                        <div className="card">
                            <div className="input-wrapper">
                                <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.5 2C13.5 2 15 3.5 15 6C15 8.5 13.5 10 13.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M17.5 4C17.5 4 19 6 19 9C19 12 17.5 14 17.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <rect x="2" y="10" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                <input
                                    type="url"
                                    id="urlInput"
                                    className="url-input"
                                    placeholder="Paste Instagram URL here..."
                                    autoComplete="off"
                                    spellCheck="false"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                {url && (
                                    <button className="clear-btn" onClick={handleClear} aria-label="Clear input">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <button
                                className="download-btn"
                                onClick={handleDownload}
                                disabled={!url || loading}
                            >
                                {!loading && (
                                    <svg className="btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 3V16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 16V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                )}
                                <span className="btn-text">{loading ? 'Processing...' : 'Download'}</span>
                            </button>

                            {loading && (
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                    <p className="loading-text">Processing your request...</p>
                                </div>
                            )}

                            {error && (
                                <div className="error-state">
                                    <svg className="error-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="22" stroke="#EF4444" strokeWidth="2" />
                                        <path d="M24 14V26" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                                        <circle cx="24" cy="32" r="2" fill="#EF4444" />
                                    </svg>
                                    <p className="error-text">{error}</p>
                                    <button className="retry-btn" onClick={() => handleDownload()}>Try Again</button>
                                </div>
                            )}

                            {renderResults()}
                        </div>

                        <div className="features">
                            <div className="feature">
                                <div className="feature-icon">⚡</div>
                                <h3 className="feature-title">Lightning Fast</h3>
                                <p className="feature-text">Download videos in seconds</p>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">🎨</div>
                                <h3 className="feature-title">High Quality</h3>
                                <p className="feature-text">Best available quality</p>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">🔒</div>
                                <h3 className="feature-title">100% Secure</h3>
                                <p className="feature-text">Your privacy matters</p>
                            </div>
                        </div>
                    </section>

                    <section className="how-to">
                        <h2 className="section-title">How to Use</h2>
                        <div className="steps">
                            <div className="step">
                                <div className="step-number">1</div>
                                <h3 className="step-title">Copy URL</h3>
                                <p className="step-text">Copy the Instagram video, reel, or story URL</p>
                            </div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <h3 className="step-title">Paste URL</h3>
                                <p className="step-text">Paste the URL into the input field above</p>
                            </div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <h3 className="step-title">Download</h3>
                                <p className="step-text">Click download and save your video</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="footer">
                <div className="container">
                    <p className="footer-text">
                        Made with ❤️ for Instagram lovers •
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
                    </p>
                    <p className="footer-disclaimer">
                        This tool is for personal use only. Please respect Instagram's terms of service.
                    </p>
                </div>
            </footer>
        </>
    );
}

export default App;
