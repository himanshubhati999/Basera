# Quick Setup Guide - Property Name in HubSpot Forms

## ⚡ Quick HubSpot Setup (5 minutes)

### Step 1: Create Custom Property
1. HubSpot → **Settings** (gear icon) → **Properties**
2. Click **Create property**
3. Settings:
   - Object: **Contact**
   - Label: **Property Inquiry**
   - Internal name: **property_inquiry**
   - Type: **Single-line text**
4. Click **Create**

### Step 2: Add to Form
1. HubSpot → **Marketing** → **Forms**
2. Open: "New contact us form"
3. Click **Edit**
4. Click **Add field** → Select "Property Inquiry"
5. Click the field → Check **Make hidden**
6. Click **Update** (or **Publish**)

### Step 3: View Property Names in Submissions
1. Go to form **Submissions** tab
2. Click **Actions** → **Edit columns**
3. Add **Property Inquiry** column
4. Click **Save**

## ✅ Done! Now Test It

1. Visit: `http://localhost:5173/property/1`
2. Fill out contact form
3. Check HubSpot → Should see property name!

## 🎯 What Happens Now

**Property Detail Page:**
- User fills form
- Submits with property name, location, price
- HubSpot receives: "Property Inquiry: Yamuna Sector 20"

**Contact Page (from property):**
- Shows: "Inquiring about: Yamuna Sector 20"
- Form includes property name automatically

**Direct Contact Page:**
- Shows as "General Inquiry"
- Normal contact form behavior

## 🔧 Verify Setup

Run this in browser console on the contact page:
```javascript
// Should return the property name or "General Inquiry"
console.log(window.location.state?.propertyName);
```

## 📊 Field Names Reference

| Display Name | Internal Name | Required |
|--------------|---------------|----------|
| Property Inquiry | property_inquiry | Yes (for this feature) |
| First Name | firstname | Depends on form |
| Email | email | Depends on form |
| Phone | phone | Depends on form |
| Message | message | Depends on form |

## 🚨 Common Issues & Fixes

**Issue:** "property_inquiry is not defined in HubSpot form"
**Fix:** You skipped Step 1 or 2 above. Create the custom property first.

**Issue:** Property name not showing in submissions
**Fix:** Add the column in Step 3.

**Issue:** All submissions show "General Inquiry"
**Fix:** Make sure you're submitting from property detail pages, not directly visiting /contact

## 💡 Pro Tips

1. **Rename Your Form:** Change from "New contact us form" to "Property Inquiry Form"
2. **Email Notifications:** Update email template to include {{contact.property_inquiry}}
3. **Lead Routing:** Create workflows based on property inquiry
4. **Analytics:** Track which properties get most inquiries

---

Need help? Check `HUBSPOT_SETUP.md` for detailed instructions.
