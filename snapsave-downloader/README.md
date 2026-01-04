# 🎥 InstaGrab - Instagram Video Downloader

A beautiful, modern full-stack web application to download Instagram videos, reels, and stories instantly.

![InstaGrab](https://img.shields.io/badge/version-2.0.0-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## ✨ Features

- 🎨 **Premium UI Design** - Modern, gradient-based interface with Instagram colors
- ⚡ **Lightning Fast** - Download videos in seconds
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🔒 **100% Secure** - Your privacy matters
- 🎯 **Easy to Use** - Just paste, click, and download
- ✨ **Smooth Animations** - Delightful micro-interactions
- 🌙 **Dark Theme** - Easy on the eyes

## 🚀 Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/milancodess/Instagram-Video-Downloader-API.git
cd Instagram-Video-Downloader-API
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
# or
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

## 📖 How to Use

1. **Copy URL** - Copy any Instagram video, reel, or story URL
2. **Paste URL** - Paste it into the input field on the web app
3. **Download** - Click the download button and save your video!

## 🛠️ Project Structure

```
Instagram-Video-Downloader-API/
├── public/                  # Frontend files
│   ├── index.html          # Main HTML file
│   ├── style.css           # Premium CSS styles
│   └── script.js           # JavaScript functionality
├── snapsave-downloader/    # Instagram downloader module
│   └── src/
│       └── index.js        # Core downloader logic
├── index.js                # Express server
├── package.json            # Dependencies
└── README.md              # This file
```

## 🎨 Tech Stack

### Frontend
- **HTML5** - Semantic, accessible markup
- **CSS3** - Modern styles with custom properties
- **Vanilla JavaScript** - No frameworks, pure performance
- **Google Fonts** - Poppins & Inter

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client
- **Cheerio** - HTML parsing

## 🌐 API Endpoints

### Web Interface
- `GET /` - Main web application

### API Endpoints
- `GET /api` - API information
- `GET /igdl?url=<instagram_url>` - Download Instagram media

**Example:**
```
http://localhost:3000/igdl?url=https://www.instagram.com/p/DLHQfPiyucu/
```

## 💡 Features Breakdown

### Premium Design
- Instagram-inspired gradient color scheme
- Glassmorphism effects
- Smooth transitions and animations
- Responsive layout for all screen sizes

### User Experience
- Auto-paste from clipboard
- Real-time URL validation
- Loading states with smooth animations
- Error handling with helpful messages
- Download progress indication

### Performance
- Optimized assets
- Minimal dependencies
- Fast API responses
- Smooth 60fps animations

## 🔧 Development

### Available Scripts

```bash
# Start the server
npm start

# Run in development mode
npm run dev

# Fix security vulnerabilities
npm audit fix
```

### Environment

- Node.js >= 14.0.0
- npm >= 6.0.0

## 📝 Usage Examples

### Download a Video
1. Go to Instagram and find the video you want to download
2. Click the three dots (•••) and select "Copy Link"
3. Paste the link into InstaGrab
4. Click "Download"
5. Choose your preferred quality and save!

### Supported Content Types
- ✅ Instagram Posts (Videos)
- ✅ Instagram Reels
- ✅ Instagram TV (IGTV)
- ✅ Instagram Stories

## ⚠️ Important Notes

- This tool is for **personal use only**
- Please respect Instagram's **Terms of Service**
- Do not use this tool to violate copyright laws
- Always credit content creators

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original API by [Milan Bhandari](https://github.com/milancodess)
- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for Instagram lovers
