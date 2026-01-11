# HubSpot CRM Integration

## ✅ Implementation Complete

Your contact form now uses HubSpot's embedded form widget. All submissions will automatically go to your HubSpot CRM.

## 🔧 Configuration

**HubSpot Portal ID:** `244826787`  
**Form ID:** `1dc60e00-39fd-403e-b865-4cc88a315b03`  
**Region:** `na2`

## 📝 How It Works

1. **Contact Page** (`/contact`): Uses HubSpot's embedded form
2. **Script Loading**: Automatically loads `https://js-na2.hsforms.net/forms/embed/244826787.js`
3. **Form Rendering**: HubSpot automatically renders the form in the designated div
4. **Submissions**: All form data goes directly to your HubSpot CRM

## 🚀 Deployment on Vercel

The form will work perfectly on Vercel because:

✅ CSP headers are configured in both `index.html` and `vercel.json`  
✅ HubSpot domains are whitelisted  
✅ Uses HubSpot's native embedded form (no custom API calls)  

## 📋 What Was Configured

### Files Updated:

1. **[src/pages/Contact.jsx](src/pages/Contact.jsx)**
   - Loads HubSpot embed script on component mount
   - Uses the `hs-form-frame` div with your form credentials

2. **[index.html](index.html)**
   - Added Content Security Policy headers for HubSpot

3. **[vercel.json](vercel.json)**
   - Added HubSpot CSP headers for Vercel deployment

4. **[src/pages/Contact.css](src/pages/Contact.css)**
   - Basic styling for the form container

## 🎯 Testing

### Local Testing:
```bash
npm run dev
```
Visit `http://localhost:5173/contact` and test the form

### Vercel Deployment:
```bash
vercel --prod
```

## ✨ Features

- ✅ All submissions go directly to HubSpot CRM
- ✅ Works on Vercel deployment
- ✅ Property name pre-fill (when coming from property detail pages)
- ✅ HubSpot's built-in validation and features
- ✅ HubSpot's spam protection
- ✅ Mobile responsive

## 📊 View Submissions

All form submissions can be viewed in your HubSpot account:

🔗 https://app.hubspot.com/

Navigate to: **Contacts** → **Forms** → View your form submissions

## 🔍 Troubleshooting

If the form doesn't appear:

1. **Check Console**: Open browser console (F12) and look for errors
2. **Verify IDs**: Ensure Portal ID and Form ID are correct in your HubSpot account
3. **Check Network**: Make sure HubSpot scripts aren't blocked by firewall/ad blocker
4. **CSP Headers**: Verify Content-Security-Policy headers include HubSpot domains

## 📞 Support

If you need to customize the form fields:
1. Go to HubSpot → Marketing → Forms
2. Edit your form (ID: `1dc60e00-39fd-403e-b865-4cc88a315b03`)
3. Add/remove/modify fields as needed
4. Changes will automatically reflect in your website

---

**Note**: This is a production-ready implementation using HubSpot's official embedded form widget.
