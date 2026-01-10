# Quick Fix Guide - CRM on Vercel

## ✅ Latest Fix (Jan 10, 2026)

**Issue**: "HubSpot form is still loading. Please try again in a moment."

**Solution**: Added loading state tracking with visual feedback

### Changes:
1. ✅ Added `isHubSpotLoaded` state to track script loading
2. ✅ Script loading now waits and verifies HubSpot is ready
3. ✅ Submit button shows "Loading form..." until ready
4. ✅ Button is disabled until HubSpot script loads
5. ✅ Better error handling with retry mechanism

---

## What Was Fixed

✅ **PropertyDetail.jsx** - Added loading state and proper script initialization
✅ **Created serverless function** - `/api/submit-form.js` as backup solution
✅ **Contact.jsx** - Already uses embedded forms (no changes needed)

---

## Deploy Now

```bash
# Build and test locally first
npm run build
npm run preview

# Deploy to Vercel
vercel --prod
```

---

## Why It Failed Before

❌ **CORS Issue**: Direct browser calls to `api.hsforms.com` blocked on production
❌ **Missing proxy**: No server-side proxy to handle the request
❌ **Script timing**: Form submitted before HubSpot script finished loading

## Why It Works Now

✅ **HubSpot Script**: Uses HubSpot's official embed script (handles CORS)
✅ **Loading State**: Waits for script to be ready before enabling submission
✅ **Visual Feedback**: Button shows loading state to users
✅ **Serverless Function**: Available as backup to proxy requests through your server

---

## Test After Deployment

1. Visit your Vercel URL
2. Go to any property detail page
3. Wait for submit button to change from "Loading form..." to "Send Message"
4. Fill out the contact form
5. Submit
6. Check HubSpot dashboard for the submission

---

## If Issues Persist

See detailed guide: [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md)

Quick checks:
- Open browser DevTools (F12) → Console tab
- Look for any errors in red
- Check Network tab for failed requests
- Verify submit button says "Send Message" (not "Loading form...")
- Run: `vercel logs` to see server errors

---

## Alternative: Use Serverless Function

If embedded forms are slow, switch to serverless function:

In **PropertyDetail.jsx**, replace the `handleSubmit` function with:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const submissionData = {
    fields: [
      { name: 'firstname', value: formData.name },
      { name: 'phone', value: formData.phone },
      { name: 'email', value: formData.email },
      { name: 'property_inquiry', value: project.name },
      { name: 'message', value: `Property: ${project.name}...` }
    ]
  };
  
  const response = await fetch('/api/submit-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submissionData)
  });
  
  const result = await response.json();
  if (result.success) {
    alert(`Thank you for your interest in ${project.name}!`);
    // Reset form...
  }
};
```

That's it! Deploy and test.
