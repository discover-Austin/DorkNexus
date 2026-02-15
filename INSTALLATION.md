# Installation Guide

Complete guide for setting up DorkNexus on your system.

## Quick Setup (Recommended)

For the fastest setup experience, use our interactive Setup Wizard:

```bash
npm run setup
```

The wizard will guide you through:
1. System requirements check
2. Dependency installation
3. API key configuration
4. Starting the application

If you prefer manual setup, continue reading below.

---

## Prerequisites

Before installing DorkNexus, ensure you have:

- **Node.js** version 18.0.0 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm** (included with Node.js)
  - Verify: `npm --version`

- **Google Gemini API Key**
  - Get yours at: https://aistudio.google.com/apikey
  - Free tier available with generous limits

## Installation Steps

### Step 1: Extract the Package

Extract the DorkNexus package to your desired location:

```bash
# If you received a zip file
unzip dorknexus.zip -d dorknexus
cd dorknexus

# Or if you received a tar.gz
tar -xzf dorknexus.tar.gz
cd dorknexus
```

### Step 2: Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

This will install:
- React 19 and React DOM
- Google Gemini AI SDK
- Lucide React icons
- TypeScript and Vite (dev dependencies)

### Step 3: Configure API Key

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` in your text editor:
```bash
# Using nano
nano .env.local

# Using vim
vim .env.local

# Using VS Code
code .env.local
```

3. Add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

4. Save and close the file.

> **Important**: Never commit `.env.local` to version control or share your API key.

### Step 4: Start the Application

#### Development Mode (recommended for first-time setup)

```bash
npm run dev
```

This starts a development server at `http://localhost:3000` with:
- Hot module replacement (instant updates)
- Development error messages
- Source maps for debugging

#### Production Mode

For production deployment:

```bash
# Build the application
npm run build

# Preview the build locally
npm run preview
```

The production build creates optimized files in the `dist/` folder.

## Verification

After starting the application:

1. Open your browser to `http://localhost:3000`
2. You should see the DorkNexus interface with 8 tabs
3. Try the AI Generator tab to verify API connectivity
4. If you see AI responses, your setup is complete!

## Troubleshooting

### "GEMINI_API_KEY is not defined"

- Ensure `.env.local` exists in the root directory
- Check that the key name is exactly `GEMINI_API_KEY`
- Restart the development server after changing environment variables

### "npm install" fails

- Ensure you have Node.js 20+ installed
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and try again: `rm -rf node_modules && npm install`

### Port 3000 already in use

Another application is using port 3000. Either:
- Stop the other application
- Or modify `vite.config.ts` to use a different port

### API Rate Limits

Google Gemini has rate limits. If you see rate limit errors:
- Wait a few minutes before retrying
- Consider upgrading your API tier for higher limits

## Deployment Options

### Static Hosting (Vercel, Netlify, etc.)

1. Build the project: `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Set the `GEMINI_API_KEY` environment variable in your hosting dashboard

### Docker (Advanced)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t dorknexus .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key dorknexus
```

### Self-Hosted Server

For production servers, consider using:
- **nginx** or **Apache** to serve the static `dist/` files
- **PM2** for process management if using preview mode
- **HTTPS** via Let's Encrypt for secure connections

## Security Notes

### API Key Visibility Warning

> **Important**: Your Gemini API key is embedded in the client-side JavaScript bundle at build time. This is standard for frontend applications, but be aware:

| Concern | Reality |
|---------|---------|
| Is my key visible? | Yes, in browser DevTools (Network/Sources tab) |
| Is this normal? | Yes, for client-side apps |
| Is this a problem? | Only if you deploy publicly without restrictions |

### Protecting Your API Key

**For Personal/Internal Use:**
- Your key is safe for local development and internal tools
- Set usage quotas in Google Cloud Console as a safety net

**For Public Deployment:**
1. **Set API Key Restrictions** in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Restrict to specific HTTP referrers (your domain)
   - Set daily quota limits
   - Enable billing alerts

2. **Consider a Backend Proxy** for production:
   - Route API calls through your server
   - Keep the key server-side only
   - Add rate limiting and authentication

3. **Use Separate Keys**:
   - Development key (unrestricted, low quota)
   - Production key (restricted, monitored)

### General Security

- Never commit `.env.local` to version control
- The application runs entirely in the browser after initial load
- AI queries are sent to Google Gemini API (see [PRIVACY.md](PRIVACY.md))
- Saved queries in NexusVault are stored locally in your browser
- See [SECURITY.md](SECURITY.md) for vulnerability reporting

## Support

If you encounter issues not covered here, please contact support through your purchase platform.

---

Thank you for choosing DorkNexus!
