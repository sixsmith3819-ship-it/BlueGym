# 🔐 Authentication Setup Guide

## Overview
The Blue Gym app uses Supabase Authentication for secure admin login.

---

## ✅ What I Just Fixed

Created the missing authentication API routes:
- ✅ `app/api/auth/login/route.ts` - Handles user login
- ✅ `app/api/auth/logout/route.ts` - Handles user logout

Now your login will work properly!

---

## 🚀 Setting Up Your Admin User

### Step 1: Enable Email Auth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Email** provider
4. Enable it if not already enabled
5. **Disable** "Confirm email" for easier testing (optional)

### Step 2: Create Admin User

#### Option A: Via Supabase Dashboard (Recommended)
1. Go to **Authentication** → **Users**
2. Click **"Add user"** or **"Invite user"**
3. Select **"Create new user"**
4. Enter:
   - **Email:** `admin@bluegym.com` (or your preferred email)
   - **Password:** `YourSecurePassword123!`
   - **Auto Confirm User:** ✅ Check this box
5. Click **"Create user"**

#### Option B: Via SQL (Advanced)
```sql
-- This creates a user in Supabase Auth
-- Replace with your actual email and password
-- Note: Supabase will hash the password automatically
```

**Note:** You MUST create the user through Supabase Dashboard or Auth API, not directly in the database.

---

## 🧪 Testing Login

### 1. Start the dev server:
```cmd
dev.bat
```

### 2. Navigate to login:
```
http://localhost:3000/login
```

### 3. Enter credentials:
- **Email:** The email you created in Supabase
- **Password:** The password you set

### 4. Click "Sign In"

If successful, you'll be redirected to:
```
http://localhost:3000/dashboard
```

---

## 🔧 Troubleshooting

### "Invalid email or password" error?

**Check 1: User exists in Supabase**
1. Go to Supabase Dashboard
2. **Authentication** → **Users**
3. Verify your user is listed
4. Check the email matches exactly

**Check 2: Email confirmation**
1. Go to **Authentication** → **Providers** → **Email**
2. Scroll to **"Email Auth"** settings
3. **Disable** "Confirm email" for testing:
   - Turn OFF: "Enable email confirmations"
4. Or check your email for confirmation link

**Check 3: Environment variables**
Open `.env.local` and verify:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```
- Should be YOUR project's URL and key
- Not placeholder text

**Check 4: Supabase project is active**
1. Go to Supabase Dashboard
2. Check project status
3. Ensure it's not paused

### User created but still can't login?

**Confirm the user:**
1. Go to **Authentication** → **Users**
2. Find your user
3. If status shows "Waiting for verification":
   - Click on the user
   - Click **"Confirm email"** button
4. Try logging in again

### Still having issues?

**Check browser console:**
1. Press F12 to open DevTools
2. Go to **Console** tab
3. Look for errors when clicking "Sign In"
4. Share any red error messages

**Check terminal/server logs:**
Look for error messages when login is attempted.

---

## 🔒 Security Best Practices

### Production Checklist:
- [ ] Use strong passwords (12+ characters)
- [ ] Enable email confirmation in production
- [ ] Use environment variables for all secrets
- [ ] Enable Row Level Security (RLS) on database
- [ ] Use HTTPS in production
- [ ] Set up proper CORS policies
- [ ] Regularly update dependencies

### Environment Variables:
Never commit these to Git:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  ⚠️ Keep this SECRET!
```

---

## 📝 How Authentication Works

### Login Flow:
```
1. User enters email/password
2. POST to /api/auth/login
3. Supabase validates credentials
4. Server sets secure cookies
5. User redirected to dashboard
6. Protected routes check cookies
```

### Session Management:
- **Access Token:** 1 hour validity
- **Refresh Token:** 7 days validity
- **Auto-refresh:** Supabase handles automatically
- **Stored:** HTTP-only cookies (secure)

---

## 🎯 Next Steps

### 1. Test the Login
Try logging in with your Supabase user now!

### 2. Add More Users (Future)
For now, Blue Gym uses a single admin account. To add multiple admins later:
- Create more users in Supabase Dashboard
- They can all login with their credentials

### 3. Protect Routes (Already Done)
Dashboard routes are protected - users must login first.

### 4. Add User Management (Optional)
Future enhancement: Add UI to manage admin users.

---

## 📋 Quick Reference

### Create User in Supabase:
```
Dashboard → Authentication → Users → Add user
- Email: admin@bluegym.com
- Password: YourPassword123!
- Auto confirm: ✅
```

### Login Endpoint:
```
POST /api/auth/login
Body: { "email": "...", "password": "..." }
```

### Logout Endpoint:
```
POST /api/auth/logout
```

### Check Auth Status:
```typescript
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
```

---

## ✅ Verification Checklist

Before testing login:
- [ ] Supabase user created
- [ ] Email confirmed (or confirmation disabled)
- [ ] `.env.local` has correct credentials
- [ ] Dev server running (`dev.bat`)
- [ ] Navigate to `/login`
- [ ] Enter correct email/password
- [ ] Click "Sign In"
- [ ] Should redirect to `/dashboard`

---

## 🆘 Common Error Messages

### "Invalid email or password"
- User doesn't exist in Supabase
- Email/password is incorrect
- Email not confirmed

### "Email confirmation required"
- Disable confirmation in Supabase settings
- Or confirm via email link

### "Network error"
- Check dev server is running
- Verify `.env.local` credentials
- Check Supabase project is active

### "An error occurred"
- Check browser console (F12)
- Check terminal logs
- Verify API route was created

---

**Authentication is now set up! Create a user in Supabase and try logging in.** 🚀

For questions, check the Troubleshooting section above.
