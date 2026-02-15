# DorkNexus Support

Thank you for purchasing DorkNexus! This document outlines how to get help and support.

---

## Contact Information

| Method | Details |
|--------|---------|
| **Email** | biblicalandr0id@gmail.com |
| **Phone** | (317) 643-1578 |

**Support Hours**: Responses typically within 24-48 business hours.

---

## Before Contacting Support

Please try these steps first:

### 1. Check the Documentation
- [README.md](README.md) - Overview and quick start
- [INSTALLATION.md](INSTALLATION.md) - Detailed setup instructions
- [CHANGELOG.md](CHANGELOG.md) - Version history and known issues

### 2. Run the Setup Wizard
If you're having installation issues, try running:
```bash
npm run setup
```

### 3. Common Issues

#### "GEMINI_API_KEY is not defined"
- Ensure `.env.local` exists with your API key
- Restart the dev server after adding the key
- Check for typos in the variable name

#### "npm install" fails
- Verify Node.js 20+ is installed: `node --version`
- Clear cache: `npm cache clean --force`
- Delete and reinstall: `rm -rf node_modules && npm install`

#### App won't start
- Check if port 3000 is available
- Review terminal for error messages
- Ensure all dependencies installed successfully

#### AI features not working
- Verify your Gemini API key is valid
- Check API quota at https://aistudio.google.com
- Review browser console for error messages

---

## How to Report Issues

When contacting support, please include:

1. **DorkNexus version** (found in app footer or package.json)
2. **Operating system** (Windows, macOS, Linux)
3. **Node.js version** (`node --version`)
4. **Browser** (Chrome, Firefox, Safari, etc.)
5. **Error messages** (copy from terminal or browser console)
6. **Steps to reproduce** the issue

### Example Support Request

```
Subject: Installation Error - DorkNexus v1.0.0

Version: 1.0.0
OS: Windows 11
Node: v20.10.0
Browser: Chrome 120

Issue: After running npm install, I get the following error:
[paste error here]

Steps to reproduce:
1. Extracted zip to C:\dorknexus
2. Ran npm install
3. Error appeared
```

---

## Feature Requests

Have an idea to improve DorkNexus? We'd love to hear it!

Send feature requests to **biblicalandr0id@gmail.com** with:
- Subject line: "Feature Request - [Brief Description]"
- Detailed description of the feature
- Use case / why it would be helpful

---

## License & Refund Policy

- See [LICENSE](LICENSE) for full terms of use
- Refund requests must be made within 7 days of purchase
- Contact via email with your purchase receipt

---

## Updates

Product updates and announcements will be sent to your purchase email. Make sure to check for updates periodically to get the latest features and security patches.

---

**Thank you for choosing DorkNexus!**
