# Deployment Configuration Guide

## Environment Variables Setup

### For Local Development:
The `.env` file should contain:
```
VITE_API_URL=http://localhost:5000
```

### For Production Deployment:

#### Step 1: Deploy Backend
1. Deploy your backend folder to a hosting service (Render, Railway, Heroku, etc.)
2. Get your backend URL (e.g., `https://your-app.onrender.com`)

#### Step 2: Configure Frontend Environment
Set the following environment variable in your deployment platform (Vercel/Netlify):

**Variable Name:** `VITE_API_URL`
**Value:** Your deployed backend URL (e.g., `https://your-app.onrender.com`)

#### For Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `VITE_API_URL` with your backend URL
4. Redeploy the project

#### For Netlify:
1. Go to Site settings > Build & deploy > Environment
2. Add `VITE_API_URL` with your backend URL
3. Redeploy the project

## Content Security Policy (CSP)

The CSP in `index.html` allows connections to:
- localhost:5000 (for development)
- *.onrender.com (for Render deployments)
- *.vercel.app (for Vercel deployments)
- *.herokuapp.com (for Heroku deployments)
- *.railway.app (for Railway deployments)

If your backend is hosted on a different platform, update the CSP in `index.html`:
```html
connect-src 'self' http://localhost:5000 https://your-backend-domain.com ...
```

## Troubleshooting

If you see "Failed to fetch" or CSP errors after deployment:
1. Check that `VITE_API_URL` is set correctly in your deployment platform
2. Verify your backend is running and accessible
3. Ensure the CSP in `index.html` allows connections to your backend domain
4. Clear cache and redeploy both frontend and backend
