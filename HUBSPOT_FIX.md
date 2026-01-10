# HubSpot Form Fix for Vercel Deployment

## Changes Made

### 1. Updated Contact.jsx
- Changed the HubSpot script URL to use the standard v2.js embed script: `https://js-na2.hsforms.net/forms/embed/v2.js`
- Added proper error handling and console logging
- Script is now loaded in the `<head>` instead of `<body>` for better compatibility
- Added async loading to prevent blocking

### 2. Updated vercel.json
- Added Content Security Policy (CSP) headers to allow HubSpot scripts and connections
- Whitelisted all necessary HubSpot domains:
  - `js.hsforms.net`, `js-na2.hsforms.net` - for form scripts
  - `forms.hsforms.com`, `forms-na2.hsforms.com` - for form submissions
  - Other HubSpot analytics and tracking domains

## Testing Steps

### Local Testing
1. Open http://localhost:5173/
2. Navigate to the Contact page
3. Open browser console (F12)
4. You should see:
   - "HubSpot script loaded successfully"
   - "Creating HubSpot form..."
   - "HubSpot form is ready"
5. The form should be visible and functional

### Deployment Steps
1. Commit the changes:
   ```bash
   git add .
   git commit -m "Fix HubSpot form loading on Vercel"
   git push origin master
   ```

2. Wait for Vercel to deploy (check your Vercel dashboard)

3. Test on the deployed site:
   - Open your Vercel URL
   - Go to Contact page
   - Open browser console
   - Verify console messages appear
   - Test form submission

## Troubleshooting

### If form still doesn't show:
1. **Check Console Errors**: Open browser console (F12) and look for any errors
2. **Verify Form ID**: Confirm `1dc60e00-39fd-403e-b865-4cc88a315b03` is correct in HubSpot
3. **Check Portal ID**: Verify `244826787` is your correct HubSpot Portal ID
4. **Check Region**: Ensure `na2` is your correct HubSpot region

### Console Messages Meaning:
- ✅ "HubSpot script loaded successfully" - Script file loaded
- ✅ "Creating HubSpot form..." - Attempting to create form
- ✅ "HubSpot form is ready" - Form rendered successfully
- ❌ "Failed to load HubSpot script" - Network or CSP issue
- ❌ "HubSpot object not found" - Script loaded but API not available

## Additional Notes

The form will now:
- Load properly on Vercel with CSP headers
- Show console logs for debugging
- Handle the property inquiry field if configured in HubSpot
- Work with your embedded form approach

## Your HubSpot Embed Code Reference
```html
<script src="https://js-na2.hsforms.net/forms/embed/244826787.js" defer></script>
<div class="hs-form-frame" data-region="na2" data-form-id="1dc60e00-39fd-403e-b865-4cc88a315b03" data-portal-id="244826787"></div>
```

The new implementation uses the programmatic API which is more reliable for React applications than the data-attribute approach.
