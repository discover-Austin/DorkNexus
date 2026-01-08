# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in DorkNexus, please report it responsibly.

### How to Report

**Email**: biblicalandr0id@gmail.com

**Subject Line**: `[SECURITY] Brief description of vulnerability`

### What to Include

1. **Description**: Clear explanation of the vulnerability
2. **Steps to Reproduce**: Detailed steps to replicate the issue
3. **Impact Assessment**: What could an attacker potentially do?
4. **Affected Components**: Which files/features are affected
5. **Suggested Fix**: If you have recommendations (optional)

### Response Timeline

| Action | Timeframe |
|--------|-----------|
| Initial acknowledgment | 48 hours |
| Status update | 7 days |
| Resolution target | 30 days |

### What to Expect

- We will acknowledge receipt of your report within 48 hours
- We will investigate and provide status updates
- We will work with you to understand and resolve the issue
- We will credit you in the changelog (unless you prefer anonymity)

### Scope

**In Scope:**
- DorkNexus application code
- Setup wizard and scripts
- Build configuration
- Dependencies with known vulnerabilities

**Out of Scope:**
- Google Gemini API (report to Google)
- Third-party hosting platforms
- Social engineering attacks
- Issues already publicly known

## Security Best Practices for Users

### API Key Protection

Your Gemini API key is embedded in the client-side JavaScript bundle. This is by design for frontend applications, but be aware:

- **Do NOT** use API keys with billing enabled for public deployments
- **Do** set API key restrictions in Google Cloud Console
- **Do** monitor your API usage regularly
- **Consider** implementing a backend proxy for production use

### Deployment Security

1. **HTTPS Only**: Always deploy with SSL/TLS encryption
2. **Access Control**: Restrict access if deploying internally
3. **Updates**: Keep dependencies updated (`npm audit`)
4. **Monitoring**: Watch for unusual API usage patterns

### Local Development

- Never commit `.env.local` to version control
- Use unique API keys for development vs. production
- Regularly rotate API keys

## Responsible Disclosure

We kindly request that you:

1. Give us reasonable time to address the issue before public disclosure
2. Avoid accessing or modifying other users' data
3. Act in good faith to avoid privacy violations and data destruction

Thank you for helping keep DorkNexus secure!
