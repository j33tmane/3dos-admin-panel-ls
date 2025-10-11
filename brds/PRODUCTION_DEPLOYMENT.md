# Production Deployment Guide

## 🚀 Environment Setup

### 1. Create Production Environment File

Create a `.env.production` file in your project root:

```bash
# Production API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/v1
API_BASE_URL=https://your-production-api.com/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=3DOS Admin Panel
NEXT_PUBLIC_APP_VERSION=1.0.0

# Production Settings
NODE_ENV=production
NEXT_PUBLIC_ENV=production
```

### 2. Update API Base URL

Replace `https://your-production-api.com/v1` with your actual production API URL.

## 🏗️ Build Commands

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build:prod
```

### Start Production Server

```bash
npm run start:prod
```

### Build Analysis

```bash
npm run analyze
```

## 📦 Build Process

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Production Build

```bash
npm run build:prod
```

### 3. Start Production Server

```bash
npm run start:prod
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `API_BASE_URL`
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_VERSION`
3. Deploy automatically on push to main branch

### Option 2: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build:prod

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Option 3: Traditional Server

1. Build the application: `npm run build:prod`
2. Upload the `.next` folder and `package.json` to your server
3. Install production dependencies: `npm ci --only=production`
4. Start the server: `npm run start:prod`

## 🔧 Environment Variables

### Required Variables

- `NEXT_PUBLIC_API_BASE_URL`: Your production API base URL
- `API_BASE_URL`: Server-side API base URL (same as above)

### Optional Variables

- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Application version
- `NEXT_PUBLIC_ENV`: Environment identifier

## 📊 Build Optimization

The production build includes:

- ✅ **Code Splitting**: Automatic code splitting for optimal loading
- ✅ **Tree Shaking**: Removes unused code
- ✅ **Minification**: Compressed JavaScript and CSS
- ✅ **Image Optimization**: Optimized images
- ✅ **Static Generation**: Pre-rendered pages where possible
- ✅ **Standalone Output**: Self-contained build for easy deployment

## 🔍 Build Analysis

To analyze your bundle size:

```bash
npm run analyze
```

This will open a web interface showing:

- Bundle size breakdown
- Largest dependencies
- Code splitting analysis
- Performance recommendations

## 🚨 Production Checklist

Before deploying:

- [ ] Update API base URL in environment variables
- [ ] Test all API endpoints work with production URL
- [ ] Verify authentication flow works
- [ ] Check all pages load correctly
- [ ] Test responsive design on different devices
- [ ] Verify error handling works properly
- [ ] Check console for any errors
- [ ] Test performance with production data

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**

   - Verify `NEXT_PUBLIC_API_BASE_URL` is correct
   - Check CORS settings on your API server
   - Ensure API server is accessible from your domain

2. **Build Failures**

   - Check for TypeScript errors: `npm run lint`
   - Verify all imports are correct
   - Ensure all environment variables are set

3. **Runtime Errors**
   - Check browser console for errors
   - Verify all API endpoints are working
   - Check network tab for failed requests

### Performance Optimization

1. **Enable Compression**

   - Already configured in `next.config.mjs`
   - Ensure your server supports gzip compression

2. **CDN Setup**

   - Use a CDN for static assets
   - Configure proper cache headers

3. **Monitoring**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor performance metrics
   - Track API response times
