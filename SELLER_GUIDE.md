# DorkNexus — Complete Seller Guide

Everything you need to sell DorkNexus, from setup to distribution.

---

## Quick Reference

| Item | Location |
|------|----------|
| Distribution Package | `dist-packages/dorknexus-v1.0.0.zip` |
| Your Contact | biblicalandr0id@gmail.com / (317) 643-1578 |
| Suggested Price | $49 |
| Best Platform | Gumroad or Lemon Squeezy |

---

## Step 1: Generate Distribution Package

```bash
npm run package
```

This creates `dist-packages/dorknexus-v1.0.0.zip` (29KB) containing:
- Full source code
- Setup wizard
- All documentation (README, INSTALL, SUPPORT, SECURITY, PRIVACY, CHANGELOG, LICENSE)
- No node_modules, .git, or your .env.local

---

## Step 2: Choose a Sales Platform

| Platform | Fee | Why Choose It |
|----------|-----|---------------|
| **Gumroad** | 10% | Easiest setup, good for starting |
| **Lemon Squeezy** | 5-8% | Lower fees, handles global taxes |
| **Payhip** | 5% / 0% ($29/mo) | Simple, low fees |
| **CodeCanyon** | 37-55% | Built-in audience, strict review |

**Recommendation:** Start with Gumroad — you can be selling in 15 minutes.

---

## Step 3: Create Your Listing

### Product Title
```
DorkNexus — AI-Powered Google Dorking Toolkit
```

### Short Description (for previews)
```
AI-powered Google dorking toolkit for security professionals. Generate queries from plain English, analyze dorks with AI, access 60+ templates, translate to Shodan/Censys. Self-hosted, React + Gemini AI. Includes source code & documentation.
```

### Full Description

```
🔍 DorkNexus — The AI-Powered Google Dorking Toolkit

Stop wasting hours on manual dork queries. DorkNexus combines Google's Gemini AI with an intuitive interface built for security professionals.

WHAT YOU GET:

✅ AI Query Generation — Describe what you want in plain English, get perfect syntax
✅ Deep Analysis — Paste any dork, get AI analysis with risk assessment
✅ 60+ Templates — Pre-built dorks for webcams, configs, exposed files, vulns
✅ Multi-Engine — Translate to Shodan, Censys, Hunter.io, ZoomEye in one click
✅ Research Hub — AI-powered topic research with live search data
✅ Voice Commands — Hands-free operation
✅ Query Vault — Save and organize your best dorks
✅ Video Generator — AI-created educational tutorials

TECHNICAL DETAILS:

• React 19 + TypeScript + Vite
• Google Gemini 3 Pro (32K thinking mode)
• Self-hosted / runs locally
• No telemetry or tracking
• Dark mode UI
• Mobile responsive

WHAT'S INCLUDED:

• Complete source code
• Interactive setup wizard
• Comprehensive documentation
• Security & privacy policies
• Commercial license

REQUIREMENTS:

• Node.js 20+
• Gemini API key (free tier available)
• Modern web browser

PERFECT FOR:

• Penetration testers
• Bug bounty hunters
• OSINT investigators
• Security researchers
• Red team operators

One-time purchase. Self-hosted. Your data stays private.
```

### Pricing
- **Recommended:** $49 (sweet spot for impulse buys)
- **Launch discount:** $34 (30% off for first week)
- **Premium option:** $79-99 with "priority support"

---

## Step 4: Take Screenshots

Capture these screens from the running app (`npm run dev`):

1. **Builder tab** — With a constructed query visible
2. **AI Generator** — Showing generated output from a prompt
3. **Deep Analysis** — AI analysis with risk levels
4. **Template Gallery** — Grid of 60+ templates
5. **Multi-Pivot** — Shodan/Censys translation
6. **Setup Wizard** — Professional first-run experience

**Tips:**
- Use the dark theme (it's default)
- Show realistic queries
- Highlight the AI responses

---

## Step 5: Launch & Promote

### Twitter/X Post
```
🚀 Just launched DorkNexus

AI-powered Google dorking for security pros.

→ Plain English to dork syntax
→ 60+ templates included
→ Multi-engine translation
→ Self-hosted & private

Built with React + Gemini AI.

[LINK]

#infosec #osint #bugbounty
```

### LinkedIn Post
```
Excited to launch DorkNexus — an AI-powered Google dorking toolkit for security researchers.

Instead of manually crafting complex search queries, describe what you're looking for in plain English. The AI generates optimized dork syntax instantly.

Features:
• AI query generation (Gemini 3 Pro)
• 60+ pre-built templates
• Multi-engine translation (Shodan, Censys, etc.)
• Self-hosted, privacy-focused

Perfect for pentesters, bug bounty hunters, and OSINT investigators.

[LINK]

#cybersecurity #osint #pentesting
```

### Reddit (r/netsec, r/osint)
```
Title: I built an AI-powered Google dorking toolkit

Combines Gemini AI with a dorking interface for security researchers.

Features:
- Generate dorks from plain English
- Analyze existing dorks (risk levels, optimizations)
- 60+ templates (webcams, configs, exposed files)
- Translate to Shodan/Censys/Hunter.io

Tech: React 19, TypeScript, Vite, Gemini 3 Pro

Self-hosted, no telemetry.

[LINK]
```

---

## Package Contents (What Buyers Get)

```
dorknexus-v1.0.0/
├── Source Code
│   ├── App.tsx, index.tsx, index.html
│   ├── components/ (9 React components)
│   ├── services/geminiService.ts
│   └── utils/audio.ts
├── Config
│   ├── package.json, package-lock.json
│   ├── tsconfig.json, vite.config.ts
│   ├── .env.example, .npmrc, .gitignore
│   └── metadata.json
├── Documentation
│   ├── README.md (overview)
│   ├── INSTALLATION.md (setup guide)
│   ├── SUPPORT.md (your contact info)
│   ├── SECURITY.md (vuln reporting)
│   ├── PRIVACY.md (data handling)
│   ├── CHANGELOG.md (version history)
│   └── LICENSE (commercial terms)
├── Setup
│   ├── setup.js (interactive wizard)
│   └── scripts/deploy.sh
```

**NOT included in buyer package:**
- node_modules/
- .git/
- .env.local
- dist/
- scripts/package.sh
- PROMOTIONAL.md

---

## Handling Support

When buyers contact you:

1. **Setup issues** → Point to INSTALLATION.md troubleshooting section
2. **API key issues** → Verify they have valid Gemini key, check .env.local
3. **Feature requests** → Log for future versions
4. **Refunds** → Honor within 7 days per LICENSE terms

---

## Updating the Product

When you release updates:

1. Update version in:
   - `package.json` ("version": "1.1.0")
   - `constants.tsx` (APP_VERSION)
   - `scripts/package.sh` (VERSION variable)

2. Update `CHANGELOG.md` with changes

3. Run `npm run package` to create new zip

4. Upload new version to your sales platform

---

## Legal Protection (Already in Place)

| Document | Protection |
|----------|------------|
| LICENSE | Commercial terms, no redistribution |
| SECURITY.md | Vulnerability reporting process |
| PRIVACY.md | Data handling disclosure |
| INSTALLATION.md | API key security warnings |

---

## Summary Checklist

- [ ] Run `npm run package` to create zip
- [ ] Create Gumroad/Lemon Squeezy account
- [ ] Upload `dist-packages/dorknexus-v1.0.0.zip`
- [ ] Copy product description from above
- [ ] Set price ($49 recommended)
- [ ] Take 5-6 screenshots
- [ ] Publish listing
- [ ] Post on Twitter, LinkedIn, Reddit
- [ ] Monitor for support emails

---

**You're ready to sell!**

Package: `/home/user/DorkNexus/dist-packages/dorknexus-v1.0.0.zip`
