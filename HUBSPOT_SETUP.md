# HubSpot Form Setup for Dynamic Property Names

## Problem
Currently, all form submissions show as "New contact us form" with a timestamp. We want to see the specific property name in each submission.

## Solution
To get property names in your HubSpot form submissions, you need to add a custom property field to your HubSpot form.

## Steps to Set Up in HubSpot:

### 1. Create a Custom Contact Property in HubSpot
1. Log into your HubSpot account
2. Go to **Settings** (gear icon) → **Properties**
3. Click **Create property**
4. Fill in the details:
   - **Object type**: Contact
   - **Group**: Contact information
   - **Label**: Property Inquiry
   - **Internal name**: `property_inquiry`
   - **Field type**: Single-line text
   - **Description**: The property the contact is inquiring about
5. Click **Create**

### 2. Add the Property Field to Your Form
1. Go to **Marketing** → **Forms**
2. Find and open your form: "New contact us form"
3. Click **Edit**
4. In the form editor:
   - Click **Add** to add a new field
   - Search for "Property Inquiry" (the custom property you just created)
   - Add it to your form
   - Click on the field and select **Make hidden** (this makes it invisible to users but allows us to set it programmatically)
5. **Save** the form

### 3. Configure Form Field Name
The field name in HubSpot should be `property_inquiry`. If it's different, update the code in Contact.jsx:

```javascript
const propertyField = $form.find('input[name="YOUR_FIELD_NAME_HERE"]');
```

### 4. Update Form Submissions View
1. Go to **Marketing** → **Forms** → Select your form
2. Click on **Submissions** tab
3. Click on **Actions** → **Edit columns**
4. Add "Property Inquiry" to the visible columns
5. Now you'll see the property name for each submission!

### 5. Rename Form (Optional)
You can rename the form from "New contact us form" to something more descriptive:
1. Go to your form settings
2. Change the name to "Property Inquiry Form" or "Contact Form"
3. This name will appear in submission notifications

## How It Works Now:

### From Contact Page:
- Users navigate to Contact page from any property detail page
- The property name is passed via React Router state
- The HubSpot form automatically includes the property name in a hidden field
- Submission shows: "Property Inquiry: Yamuna Sector 20" (or whatever property)

### From Property Detail Page:
- Users fill out the contact form on the property detail page
- Form submission includes property name, location, price, and desired tour date
- Message field combines all this information
- Submission clearly identifies which property the inquiry is about

## Testing:
1. Visit a property detail page (e.g., Yamuna Sector 20)
2. Fill out the contact form
3. Check your HubSpot form submissions
4. You should see "Property Inquiry" column showing the property name

## Troubleshooting:
- **Field not populating**: Check that the field name matches exactly (`property_inquiry`)
- **Field not showing in submissions**: Make sure you added it to the visible columns
- **Form not loading**: Check browser console for JavaScript errors
- **Property name is "General Inquiry"**: User came directly to contact page without selecting a property

## Alternative: Use Form Name
If you prefer, you can also customize the form submission name dynamically by using HubSpot's API to create different form submissions. However, the custom property approach is simpler and more maintainable.
