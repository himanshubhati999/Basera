# Creating an Admin User

## Method 1: During Signup (Temporary for Testing)

Temporarily modify the signup controller to create an admin user:

In `backend/controllers/authController.js`, find the signup function and add:

```javascript
// Create user with admin role for first user
const user = await User.create({
  name,
  email,
  password,
  role: email === 'admin@example.com' ? 'admin' : 'user' // Make specific email admin
});
```

## Method 2: Using MongoDB Compass or Shell

Connect to your MongoDB and run:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Method 3: Create Admin Endpoint (Development Only)

Add this route temporarily in `backend/routes/auth.js`:

```javascript
// DEVELOPMENT ONLY - Remove in production
router.put('/make-admin/:email', async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    { role: 'admin' },
    { new: true }
  ).select('-password');
  
  res.json({ success: true, user });
});
```

Then call: `PUT http://localhost:5000/api/auth/make-admin/your-email@example.com`

## Security Note

The admin panel is now protected by:
1. **Frontend Check**: Redirects non-admin users to home page with alert
2. **Backend Middleware**: All admin API routes require `auth` + `adminAuth` middleware
3. **Conditional UI**: Admin Dashboard link only shows for users with `role === 'admin'`

Users without admin role cannot:
- See the Admin Dashboard link in navigation
- Access the `/admin/dashboard` page (redirected with alert)
- Call admin API endpoints (blocked by backend middleware with 403 error)
