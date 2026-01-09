# 🚀 DorkNexus Desktop - Quick Start Guide

## One-Click Installation & Launch

DorkNexus Desktop is a standalone tkinter application that works on **Windows, macOS, and Linux**.

### Prerequisites

- Python 3.8 or newer
- Internet connection (for installing dependencies and API calls)

### Installation Steps

#### Option 1: Automatic Installation (Recommended)

1. **Download or Clone** the DorkNexus repository
2. **Double-click** (or run) the installer:

   **Windows:**
   ```cmd
   python install_and_run.py
   ```

   **macOS/Linux:**
   ```bash
   python3 install_and_run.py
   ```

3. The installer will:
   - ✓ Check Python version
   - ✓ Verify pip installation
   - ✓ Install required dependencies
   - ✓ Create launcher scripts
   - ✓ Launch the application automatically

#### Option 2: Manual Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python dorknexus_app.py
   ```

### First-Time Setup

1. **Get Gemini API Key:**
   - Visit: https://aistudio.google.com/apikey
   - Create a free API key
   - Copy it

2. **Configure API Key in DorkNexus:**
   - Click "⚙️ API Settings" in the top-right corner
   - Paste your API key
   - Click "Save"

3. **Start Using DorkNexus!**
   - Build queries in the Query Builder tab
   - Generate AI-powered dorks
   - Explore templates
   - Save your favorite queries to the Vault

### Quick Launchers

After installation, you can launch DorkNexus using:

**Windows:**
- Double-click `DorkNexus.bat`
- Or run: `python dorknexus_app.py`

**macOS/Linux:**
- Double-click `DorkNexus.sh` (or run in terminal: `./DorkNexus.sh`)
- Or run: `python3 dorknexus_app.py`

**Cross-Platform:**
- Run: `python run_dorknexus.py`

### Features Overview

#### 🔧 Query Builder
- Build Google Dorks using a simple form interface
- 7 operators: site, filetype, intitle, inurl, intext, exact match, exclude
- Live preview of your query

#### 🤖 AI Intelligence
- **AI Constructor:** Describe your goal, get a perfect dork
- **Deep Analyzer:** Analyze and optimize existing dorks
- Powered by Google Gemini AI

#### 📚 Template Gallery
- 34+ pre-built professional templates
- Categories: Files, Vulnerabilities, Network, OSINT
- One-click loading

#### 💻 Nexus Terminal
- Live search interface
- Execute queries and see simulated results
- Command history

#### 🔄 Intelligence Pivot
- Translate Google Dorks to:
  - Shodan
  - Censys
  - Hunter.io
  - ZoomEye

#### 📖 Research Hub
- Research security topics
- AI-powered explanations
- Latest vulnerability information

#### 💾 Nexus Vault
- Save your favorite dorks
- Tag and organize queries
- Add notes for future reference
- Local JSON storage

### System Requirements

- **OS:** Windows 7+, macOS 10.12+, Linux (any modern distro)
- **Python:** 3.8 or newer
- **RAM:** 512MB minimum
- **Disk:** 100MB for application + dependencies

### Troubleshooting

**"python: command not found"**
- Install Python from https://python.org/downloads
- Make sure to check "Add Python to PATH" during installation

**"pip: command not found"**
- Run: `python -m ensurepip --default-pip`
- Or install pip: https://pip.pypa.io/en/stable/installation/

**API Key Issues:**
- Make sure you copied the entire key (no spaces)
- API key is saved in `dorknexus_config.json`
- Get a new key if needed: https://aistudio.google.com/apikey

**Application Won't Launch:**
- Check Python version: `python --version`
- Reinstall dependencies: `pip install -r requirements.txt`
- Check terminal for error messages

### Getting Help

- **Issues:** Report bugs on GitHub
- **Documentation:** See README.md and INSTALLATION.md
- **Security:** See SECURITY.md

### Legal Notice

⚠️ **For authorized security research and educational purposes only.**

DorkNexus is designed for:
- Authorized penetration testing
- Security research
- Educational demonstrations
- OSINT investigations with proper authorization

**DO NOT** use for:
- Unauthorized access to systems
- Illegal activities
- Privacy violations
- Malicious hacking

Always obtain proper authorization before conducting security testing.

---

**Enjoy DorkNexus Desktop! 🔍**
