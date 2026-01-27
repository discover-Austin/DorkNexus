# 🔍 DorkNexus - Professional OSINT Toolkit

[![CI](https://github.com/discover-Austin/DorkNexus/actions/workflows/ci.yml/badge.svg)](https://github.com/discover-Austin/DorkNexus/actions/workflows/ci.yml)
[![CodeQL](https://github.com/discover-Austin/DorkNexus/actions/workflows/codeql.yml/badge.svg)](https://github.com/discover-Austin/DorkNexus/actions/workflows/codeql.yml)
[![Release](https://github.com/discover-Austin/DorkNexus/actions/workflows/release.yml/badge.svg)](https://github.com/discover-Austin/DorkNexus/actions/workflows/release.yml)

DorkNexus is a professional-grade AI-powered Google Dorking toolkit designed for security researchers, penetration testers, and OSINT professionals. Powered by Google's Gemini AI, it provides comprehensive tools for constructing, analyzing, and optimizing advanced search queries.

## 🎯 Two Deployment Options

### 1. **Desktop Application** (NEW! ⭐ Recommended)
- **Standalone tkinter application** - no web server needed
- **One-click installation** - fully automated setup
- **Cross-platform** - Windows, macOS, Linux
- **Offline-capable** - works without internet (except AI features)
- **Zero dependencies** - just Python 3.8+

### 2. **Web Application** (Original)
- Built with React 19 + TypeScript + Vite
- Modern web-based interface
- Real-time preview and updates

## Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **Dork Builder** | Visual query constructor with intuitive field inputs |
| **AI Generator** | Generate sophisticated dorks from natural language prompts |
| **Deep Analyzer** | AI-powered strategy analysis with risk assessment |
| **Template Library** | 60+ pre-built dork templates organized by category |
| **Multi-Engine Pivot** | Translate queries to Shodan, Censys, Hunter.io, ZoomEye |
| **Research Hub** | AI-grounded topic research with live data |
| **NexusTerminal** | Simulated terminal with live search capabilities |
| **NexusVault** | Persistent local storage for saved queries |
| **Voice Commands** | Hands-free operation with voice input |
| **Video Generator** | AI-generated educational video tutorials |

### Technical Highlights

- **Modern Stack**: React 19 + TypeScript + Vite
- **AI Integration**: Gemini 3 Pro with thinking mode (32K token budget)
- **Real-time Preview**: Live query updates as you build
- **Dark Theme UI**: Professional cybersecurity-themed interface
- **Responsive Design**: Works on desktop and mobile
- **Local Persistence**: Save queries without external database

## 🚀 Quick Start

### Desktop Application (Recommended)

**One-Click Installation:**

```bash
# Windows
python install_and_run.py

# macOS/Linux
python3 install_and_run.py
```

That's it! The installer automatically:
- ✓ Checks Python version
- ✓ Installs dependencies
- ✓ Creates launcher scripts
- ✓ Launches the application

**See [QUICKSTART.md](QUICKSTART.md) for detailed desktop setup instructions.**

### Web Application (Alternative)

**Option 1: Setup Wizard**

```bash
npm run setup
```

**Option 2: Manual Setup**

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
npm run dev
# Open http://localhost:3000
```

See [INSTALLATION.md](INSTALLATION.md) for detailed web setup instructions.

## 📋 Requirements

### Desktop Application
- Python 3.8 or higher
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))
- ~100MB disk space

### Web Application
- Node.js 18.0.0 or higher
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))
- Modern web browser with JavaScript enabled

## 📁 Project Structure

```
dorknexus/
├── dorknexus_app.py      # Desktop application (tkinter)
├── install_and_run.py    # One-click installer
├── requirements.txt      # Python dependencies
├── DorkNexus.bat         # Windows launcher
├── DorkNexus.sh          # Unix launcher
├── components/           # React UI components (web version)
├── services/             # API integration
├── utils/                # Utilities
├── App.tsx               # Web application main
└── scripts/              # Build scripts
    ├── package.js        # Cross-platform packaging
    └── deploy.js         # Deployment script
```

## 🔧 Available Scripts

### Desktop Application

| Command | Description |
|---------|-------------|
| `python install_and_run.py` | **One-click install & launch** |
| `python dorknexus_app.py` | Run desktop app |
| `DorkNexus.bat` (Windows) | Quick launcher |
| `./DorkNexus.sh` (Unix) | Quick launcher |

### Web Application

| Command | Description |
|---------|-------------|
| `npm run setup` | Interactive setup wizard |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run package` | Create distribution zip (cross-platform) |
| `npm run deploy` | Run deployment script (cross-platform) |

## Template Categories

- **Network/IoT**: Webcams, printers, routers, SCADA systems
- **Files**: Open directories, configuration files, logs
- **Vulnerabilities**: SQL injection indicators, exposed panels
- **Miscellaneous**: Social profiles, leaked databases

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | **Desktop app quick start guide** |
| [INSTALLATION.md](INSTALLATION.md) | Detailed web setup guide |
| [SUPPORT.md](SUPPORT.md) | Support information & contact |
| [SECURITY.md](SECURITY.md) | Security policy & vulnerability reporting |
| [PRIVACY.md](PRIVACY.md) | Privacy policy & data handling |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [LICENSE](LICENSE) | Commercial license terms |

## Support

For support inquiries, see [SUPPORT.md](SUPPORT.md) or contact:
- **Email**: biblicalandr0id@gmail.com
- **Phone**: (317) 643-1578

## Legal Disclaimer

This software is intended for **authorized security research and educational purposes only**. Users are solely responsible for ensuring their use complies with all applicable laws, regulations, and terms of service. The developers assume no liability for misuse.

## License

This software is distributed under a Commercial License. See [LICENSE](LICENSE) for full terms.

**Redistribution, resale, or sharing of this software is strictly prohibited.**

---

<p align="center">
  <strong>DorkNexus</strong> &mdash; Professional OSINT Toolkit
</p>
