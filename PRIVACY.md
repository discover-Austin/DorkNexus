# Privacy Policy

**Last Updated**: January 2025

This privacy policy explains how DorkNexus handles your data.

## Overview

DorkNexus is a client-side web application. We prioritize your privacy by minimizing data collection and processing data locally whenever possible.

## Data Collection

### What We DON'T Collect

- Personal identification information
- Usage analytics or telemetry
- Search queries you construct
- Files on your computer
- Browser history

### What IS Stored Locally

| Data | Location | Purpose |
|------|----------|---------|
| Saved queries | Browser localStorage | NexusVault feature |
| Preferences | Browser localStorage | User settings |
| API key | `.env.local` file | Gemini API authentication |

**Note**: All locally stored data remains on YOUR device and is never transmitted to us.

## Third-Party Services

### Google Gemini API

DorkNexus uses Google's Gemini API for AI-powered features. When you use these features, data is sent to Google:

**Data Sent to Google:**
- Your prompts/queries to AI features
- Context provided for analysis
- Voice input (if using voice commands)

**Google's Handling:**
- Subject to [Google's Privacy Policy](https://policies.google.com/privacy)
- Subject to [Gemini API Terms](https://ai.google.dev/terms)
- Google may use data to improve their services (check their policies)

**Your Responsibilities:**
- Review Google's privacy practices
- Don't submit sensitive/personal information to AI features
- Use API key restrictions to limit exposure

### No Other Third Parties

DorkNexus does NOT integrate with:
- Analytics services (Google Analytics, Mixpanel, etc.)
- Advertising networks
- Social media trackers
- Error reporting services
- Any other third-party data collectors

## Data Transmission

| Feature | Data Transmitted | Destination |
|---------|------------------|-------------|
| AI Generator | Your prompts | Google Gemini API |
| Deep Analyzer | Dork queries for analysis | Google Gemini API |
| Research Hub | Research queries | Google Gemini API |
| Multi-Pivot | Translation requests | Google Gemini API |
| Video Generator | Video prompts | Google Gemini API |
| Voice Commands | Audio input | Google Gemini API |
| Google Search | Your constructed dork | Google Search |

**All other features operate entirely offline/locally.**

## Data Security

### Your API Key

Your Gemini API key is:
- Stored locally in `.env.local` (never transmitted to us)
- Embedded in the JavaScript bundle at build time
- Visible in browser developer tools (this is normal for frontend apps)

**Security Recommendations:**
1. Set API key restrictions in Google Cloud Console
2. Use keys with limited quotas for public deployments
3. Rotate keys periodically
4. Monitor usage in Google Cloud Console

### Local Storage

Data in browser localStorage:
- Is not encrypted by default
- Can be cleared by clearing browser data
- Is accessible to JavaScript on the same origin
- Should not contain highly sensitive information

## Your Rights

You have full control over your data:

| Action | How To |
|--------|--------|
| View stored data | Browser DevTools → Application → Local Storage |
| Delete stored data | Clear browser data or use NexusVault delete |
| Export your data | Copy from NexusVault |
| Stop data transmission | Don't use AI-powered features |

## Children's Privacy

DorkNexus is intended for security professionals and researchers. It is not designed for children under 13. We do not knowingly collect data from children.

## Changes to This Policy

We may update this privacy policy. Changes will be noted in the CHANGELOG.md with the updated date shown above.

## Contact

For privacy-related inquiries:

**Email**: biblicalandr0id@gmail.com

---

## Summary

| Question | Answer |
|----------|--------|
| Do you collect my data? | No |
| Is my data sold? | No (we don't have it) |
| Where is my data stored? | Locally on your device |
| What goes to third parties? | Only AI queries → Google Gemini |
| Can I use this offline? | Partially (non-AI features work offline) |
