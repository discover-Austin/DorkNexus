<p align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" width="100%" alt="DorkNexus Banner" />
</p>

<h1 align="center">DorkNexus</h1>

<p align="center">
  <strong>Advanced Google Dorking Toolkit for Security Research & OSINT</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg" alt="Node Version" />
  <img src="https://img.shields.io/badge/license-Commercial-red.svg" alt="License" />
  <img src="https://img.shields.io/badge/AI-Gemini%20Powered-purple.svg" alt="AI Powered" />
</p>

---

## Overview

DorkNexus is a professional-grade AI-powered Google Dorking toolkit designed for security researchers, penetration testers, and OSINT professionals. Built with React and powered by Google's Gemini AI, it provides comprehensive tools for constructing, analyzing, and optimizing advanced search queries.

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

## Quick Start

### Option 1: Setup Wizard (Recommended)

Run the interactive setup wizard for a guided installation:

```bash
npm run setup
```

The wizard will:
- Check system requirements
- Install dependencies
- Configure your API key
- Optionally start the application

### Option 2: Manual Setup

See [INSTALLATION.md](INSTALLATION.md) for detailed manual setup instructions.

```bash
# 1. Install dependencies
npm install

# 2. Configure your API key
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# 3. Start the development server
npm run dev

# 4. Open http://localhost:3000
```

## Requirements

- Node.js 18.0.0 or higher
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))
- Modern web browser with JavaScript enabled

## Project Structure

```
dorknexus/
├── components/           # React UI components
│   ├── DorkBuilder.tsx      # Manual query builder
│   ├── AiDorkGenerator.tsx  # AI generation + analysis
│   ├── TemplateGallery.tsx  # Pre-built templates
│   ├── DorkResearch.tsx     # Research hub
│   ├── MultiPivot.tsx       # Multi-engine translation
│   ├── NexusTerminal.tsx    # Terminal interface
│   ├── NexusVault.tsx       # Query storage
│   ├── VideoGenerator.tsx   # Video tutorials
│   └── VoiceCommandCenter.tsx
├── services/
│   └── geminiService.ts  # AI API integration
├── utils/
│   └── audio.ts          # Audio processing
├── App.tsx               # Main application
├── types.ts              # TypeScript definitions
└── constants.tsx         # App constants
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | **Interactive setup wizard** |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:prod` | Production build with optimizations |
| `npm run preview` | Preview production build |
| `npm run start` | Build and preview |
| `npm run clean` | Remove build artifacts |
| `npm run package` | Create distribution zip |
| `npm run deploy` | Run deployment script |

## Template Categories

- **Network/IoT**: Webcams, printers, routers, SCADA systems
- **Files**: Open directories, configuration files, logs
- **Vulnerabilities**: SQL injection indicators, exposed panels
- **Miscellaneous**: Social profiles, leaked databases

## Documentation

| Document | Description |
|----------|-------------|
| [INSTALLATION.md](INSTALLATION.md) | Detailed setup guide |
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
