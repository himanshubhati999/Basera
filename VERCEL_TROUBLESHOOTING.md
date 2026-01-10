# Fixing CRM (HubSpot) Issues on Vercel

## Problem
The HubSpot form integration works locally but fails on Vercel with CORS errors or form submission failures.

## Root Cause
Direct API calls to `api.hsforms.com` from browser are blocked by CORS when running on production domains (Vercel).

---

## ✅ Solution 1: HubSpot Embedded Forms (Already Implemented)

The PropertyDetail.jsx has been updated to use HubSpot's embedded form widget instead of direct API calls. This is the recommended approach.

### How it works:
- Creates a hidden HubSpot form dynamically
- Auto-fills form fields with user data
- Programmatically submits the form
- HubSpot's script handles CORS automatically

### Testing:
1. Deploy to Vercel: `vercel --prod`
2. Open a property detail page
3. Fill and submit the contact form
4. Check HubSpot dashboard for submissions

---

## ✅ Solution 2: Vercel Serverless Function (Backup)

A serverless function `/api/submit-form.js` has been created to proxy HubSpot API requests.

### When to use this:
- If embedded forms are slow to load
- If you need more control over submission logic
- If embedded forms conflict with your UI

### To implement:
1. The API function is already created in `/api/submit-form.js`
2. Update PropertyDetail.jsx to use this endpoint (see VERCEL_API_SOLUTION.md)
3. Deploy to Vercel

### Testing the API:
```bash
# Test locally
npm run dev

# In another terminal
curl -X POST http://localhost:5173/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "fields": [
      {"name": "firstname", "value": "Test"},
      {"name": "email", "value": "test@example.com"},
      {"name": "phone", "value": "1234567890"}
    ]
  }'
```

---

## 🔍 Debugging Steps

### 1. Check Browser Console
Open DevTools (F12) and look for:
- CORS errors
- Network request failures
- JavaScript errors

### 2. Check Network Tab
- Look for failed POST requests to `api.hsforms.com`
- Check response status codes (403 = CORS, 400 = invalid data)

### 3. Verify HubSpot Script Loads
```javascript
// In browser console
console.log(window.hbspt);
// Should show an object, not undefined
```

### 4. Check Vercel Logs
```bash
vercel logs
```

---

## 📋 HubSpot Form Setup Checklist

Make sure your HubSpot form has these fields:
- ✅ `firstname` (First Name)
- ✅ `email` (Email)
- ✅ `phone` (Phone Number)
- ✅ `property_inquiry` (Custom field - see HUBSPOT_SETUP.md)
- ✅ `message` (Message/Comments)

### To add missing fields:
1. Go to HubSpot → Marketing → Forms
2. Open form: "New contact us form"
3. Edit and add required fields
4. For custom fields, create them in Settings → Properties first

---

## 🚀 Deployment

### Deploy to Vercel:
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (if needed):
If you want to secure your HubSpot credentials:
1. In Vercel dashboard → Settings → Environment Variables
2. Add:
   - `HUBSPOT_PORTAL_ID=244826787`
   - `HUBSPOT_FORM_ID=1dc60e00-39fd-403e-b865-4cc88a315b03`
3. Update code to use `process.env.HUBSPOT_PORTAL_ID`

---

## ⚠️ Common Issues

### Issue: Form submission fails silently
**Solution**: Check that all required HubSpot form fields exist

### Issue: "hbspt is not defined"
**Solution**: Script hasn't loaded yet. Add delay or use `onFormReady` callback

### Issue: CORS error persists
**Solution**: Use the serverless function approach (Solution 2)

### Issue: Vercel function timeout
**Solution**: HubSpot API is down or rate-limited. Check HubSpot status page

---

## 📱 Contact Page

The Contact.jsx page uses HubSpot's embedded form widget by default, which should work on Vercel without issues.

If Contact page also fails:
1. Check that the HubSpot script loads (`window.hbspt`)
2. Verify form ID and portal ID are correct
3. Check browser console for errors

---

## 🎯 Testing Checklist

Before marking this as resolved:
- [ ] Deploy to Vercel
- [ ] Test form submission on PropertyDetail page
- [ ] Test form submission on Contact page
- [ ] Verify submissions appear in HubSpot dashboard
- [ ] Check that property names appear correctly in HubSpot
- [ ] Test on mobile devices
- [ ] Check Vercel function logs (if using Solution 2)

---

## 📚 Additional Resources

- [HubSpot Forms API](https://developers.hubspot.com/docs/api/marketing/forms)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## Need More Help?

If issues persist:
1. Check Vercel deployment logs
2. Verify HubSpot portal ID and form ID
3. Test the serverless function directly: `/api/submit-form`
4. Check HubSpot form settings and permissions
