# Quick Setup Instructions

## What Was Fixed

✅ Created centralized API configuration (`src/config/api.js`)
✅ Updated all components to use environment-based API URLs
✅ Updated Content Security Policy to allow common hosting platforms
✅ Created environment variable files

## What You Need To Do

### 1. Set Your Backend URL for Production

In your deployment platform (Vercel, Netlify, etc.), add this environment variable:

**Variable Name:** `VITE_API_URL`  
**Variable Value:** `https://your-backend-url.com`

Replace `https://your-backend-url.com` with your actual deployed backend URL.

### 2. Update `.env.production` File

Edit the `.env.production` file and replace:
```
VITE_API_URL=https://your-backend-url.com
```
with your actual backend URL.

### 3. If Using a Different Hosting Platform

If your backend is not on Render, Vercel, Heroku, or Railway, update the CSP in `index.html`:

Find this line:
```
connect-src 'self' http://localhost:5000 https://*.onrender.com https://*.vercel.app https://*.herokuapp.com https://*.railway.app ...
```

Add your hosting platform domain, for example:
```
connect-src 'self' http://localhost:5000 https://*.your-platform.com ...
```

### 4. Redeploy

After setting the environment variable, trigger a new deployment.

## Testing Locally

To test locally:
1. Make sure backend is running on `http://localhost:5000`
2. Run `npm run dev` in the frontend folder
3. Everything should work as before

## Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
