# 🚀 Vercel Deployment Guide for DorkNexus

This guide explains how to deploy the DorkNexus web application to Vercel.

## Prerequisites

- [Vercel account](https://vercel.com/signup) (free tier works fine)
- [Google Gemini API key](https://aistudio.google.com/apikey)
- GitHub repository access

## Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Fork or Push the Repository to GitHub**
   - Make sure your code is in a GitHub repository

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Choose your DorkNexus repository
   - Vercel will auto-detect the Vite framework

3. **Configure Environment Variables**
   - Add the following environment variable:
     - `GEMINI_API_KEY`: Your Google Gemini API key
   - Click "Add" to save the environment variable

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a live URL (e.g., `your-app.vercel.app`)

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # First deployment (will ask for configuration)
   vercel
   
   # Production deployment
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add GEMINI_API_KEY
   # Paste your API key when prompted
   # Select: Production, Preview, and Development
   ```

## Configuration Details

### vercel.json

The repository includes a `vercel.json` file with:
- **Framework**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 20.x
- **SPA Routing**: All routes redirect to `index.html`
- **Security Headers**: Added for enhanced security
- **Asset Caching**: Optimized cache headers for static assets

### Environment Variables

Required environment variables:
- `GEMINI_API_KEY` - Your Google Gemini API key (required)

To add environment variables in Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `GEMINI_API_KEY` with your API key
4. Select which environments need it (Production, Preview, Development)

### Build Settings

Vercel will automatically use these settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Deployment Process

When you push to GitHub (or deploy via CLI), Vercel will:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Deploy to CDN**
   - All static files are deployed to Vercel's global CDN
   - Your app becomes available at your Vercel URL

## Post-Deployment

### Verify the Deployment

1. Visit your Vercel URL
2. Check that the application loads
3. Test the Gemini API integration by:
   - Trying the AI Generator feature
   - Testing the Deep Analyzer
   - Verifying the Template Library loads

### Custom Domain (Optional)

To add a custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails

**Issue**: Build fails with "vite: not found"
- **Solution**: Ensure `package.json` includes vite in devDependencies

**Issue**: Build fails with module errors
- **Solution**: Run `npm install` locally to verify dependencies

### API Key Issues

**Issue**: "GEMINI_API_KEY is not set" error
- **Solution**: Add the environment variable in Vercel project settings

**Issue**: API calls fail in production
- **Solution**: Ensure the API key is set for "Production" environment

### Routing Issues

**Issue**: 404 on page refresh
- **Solution**: Verify `vercel.json` has proper SPA routing rules (already configured)

### Performance Issues

**Issue**: Slow initial load
- **Solution**: Vercel automatically optimizes, but you can:
  - Enable Vercel's Edge Network (automatic)
  - Use Vercel Analytics to identify bottlenecks

## Environment Differences

### Vercel vs Local Development

| Feature | Local | Vercel |
|---------|-------|--------|
| Base URL | `http://localhost:3000` | Your Vercel domain |
| Environment | `.env.local` file | Vercel Environment Variables |
| Build | Development mode | Production optimized |
| HTTPS | Optional | Automatic |

## Updating Your Deployment

### Automatic Deploys

If you connected via GitHub:
- **Production**: Push to `main` branch
- **Preview**: Push to any other branch or open a PR

### Manual Deploys

```bash
# Deploy current state
vercel

# Deploy to production
vercel --prod

# Deploy with build logs
vercel --debug
```

## Monitoring

### Vercel Dashboard

Monitor your deployment:
- **Analytics**: View page views, performance metrics
- **Logs**: Check build and runtime logs  
- **Functions**: Monitor any serverless functions (if added)

### Common Metrics to Watch

- Build time (should be < 2 minutes)
- Bundle size (aim for < 5MB)
- Time to Interactive (TTI)
- API response times

## Security Best Practices

1. **Environment Variables**: Never commit API keys to Git
2. **HTTPS**: Vercel provides automatic HTTPS (already configured)
3. **Headers**: Security headers are set in `vercel.json`
4. **API Keys**: Consider adding rate limiting for production use

## Cost Considerations

### Vercel Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth per month
- Automatic HTTPS
- Global CDN
- Preview deployments

### Upgrade If You Need:
- More bandwidth
- Team collaboration features
- Advanced analytics
- Priority support

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [DorkNexus GitHub Issues](https://github.com/discover-Austin/DorkNexus/issues)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## Quick Reference

```bash
# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Open deployment in browser
vercel open

# Remove deployment
vercel rm [deployment-url]
```

**Need help?** Open an issue on GitHub or contact support at biblicalandr0id@gmail.com
