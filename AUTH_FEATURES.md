# Authentication Features

This document explains the new authentication features added to Blue Gym: **Sign-up** and **Password Reset**.

## Features

### 1. Admin Sign-Up
New admin users can create an account from the login page.

**Features:**
- Email and password validation
- Password confirmation field
- Minimum 8 character password requirement
- Email verification via Supabase Auth
- Automatic email sent with verification link

**Flow:**
1. Click "Sign Up" link on login page
2. Enter email, password, and confirm password
3. Click "Create Account"
4. Check email for verification link
5. Click verification link in email
6. Return to login page and sign in

### 2. Password Reset (Forgot Password)
Existing admin users can reset their forgotten passwords.

**Features:**
- Email validation
- Secure password reset link via email
- Dedicated password reset page
- Password confirmation on reset page

**Flow:**
1. Click "Forgot password?" link on login page
2. Enter your email address
3. Click "Send Reset Email"
4. Check email for password reset link
5. Click reset link in email (opens /reset-password page)
6. Enter new password and confirm
7. Click "Update Password"
8. Return to login page and sign in with new password

## API Routes

### Sign-Up
- **Endpoint:** `/api/auth/signup`
- **Method:** POST
- **Body:** `{ email, password }`
- **Response:** Success message or error

### Password Reset Request
- **Endpoint:** `/api/auth/reset-password`
- **Method:** POST
- **Body:** `{ email }`
- **Response:** Success message or error

## Pages

### Login Page (`/login`)
- Toggle between Login, Sign-Up, and Forgot Password modes
- All authentication actions in one place
- Smooth transitions between modes

### Reset Password Page (`/reset-password`)
- Accessed via email link
- Allows user to set new password
- Validates password matches confirmation
- Redirects to login after successful reset

## Environment Variables

Add this to your `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
```

For local development, use:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

This variable is used for email redirect URLs after verification and password reset.

## Supabase Configuration

### Email Templates (Optional Customization)

You can customize the email templates in Supabase Dashboard:

1. Go to **Authentication** → **Email Templates**
2. Customize the following templates:
   - **Confirm signup**: Sent when new user signs up
   - **Reset password**: Sent when user requests password reset

### Email Settings

1. Go to **Authentication** → **Settings**
2. Configure your SMTP settings (optional - Supabase provides default email service)
3. Set your site URL to your production URL

## Security Features

- **Email validation**: Ensures valid email format
- **Password strength**: Minimum 8 characters required
- **Password confirmation**: Prevents typos during signup/reset
- **Secure tokens**: Supabase handles secure token generation
- **Email verification**: Prevents fake account creation
- **Rate limiting**: Built into Supabase Auth

## Testing Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Test sign-up:
   - Click "Sign Up"
   - Enter test email and password
   - Check email inbox for verification link

4. Test password reset:
   - Click "Forgot password?"
   - Enter email
   - Check inbox for reset link
   - Click link and set new password

## Deployment Notes

### Vercel Environment Variables

Make sure to add `NEXT_PUBLIC_APP_URL` to your Vercel project:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app`
3. Redeploy the application

### Supabase Redirect URLs

Update Supabase to allow your production URL:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to **Redirect URLs**:
   - `https://your-app.vercel.app/login`
   - `https://your-app.vercel.app/reset-password`

## Troubleshooting

### Emails not arriving
- Check spam/junk folder
- Verify Supabase email service is enabled
- Check Supabase logs for email delivery status

### Verification link not working
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly
- Check that redirect URLs are configured in Supabase
- Verify the link hasn't expired (links expire after 24 hours by default)

### Password reset not working
- Ensure user account exists and is verified
- Check Supabase logs for errors
- Verify email is spelled correctly

## Future Enhancements

Possible improvements for the future:
- Two-factor authentication (2FA)
- Social login (Google, GitHub, etc.)
- Admin role management (Super Admin, Admin, Viewer)
- Session timeout settings
- Login attempt rate limiting
- Password strength meter
- Account lockout after failed attempts
