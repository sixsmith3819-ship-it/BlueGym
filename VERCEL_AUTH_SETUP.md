# Vercel Authentication Setup Guide

Follow these steps to configure the new authentication features on Vercel.

## Step 1: Add Environment Variable to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your **BlueGym** project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add the following variable:

```
Name: NEXT_PUBLIC_APP_URL
Value: https://your-app-name.vercel.app
```

**Important:** Replace `your-app-name.vercel.app` with your actual Vercel URL

6. Select all environments (Production, Preview, Development)
7. Click **Save**

## Step 2: Configure Supabase Redirect URLs

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your Blue Gym project
3. Navigate to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   - `https://your-app-name.vercel.app/login`
   - `https://your-app-name.vercel.app/reset-password`

5. Save the settings

## Step 3: Customize Email Templates (Optional)

### Sign-Up Confirmation Email

1. In Supabase, go to **Authentication** → **Email Templates**
2. Select **Confirm signup**
3. Customize the template as needed
4. Make sure the `{{ .ConfirmationURL }}` placeholder is included

### Password Reset Email

1. In Supabase, go to **Authentication** → **Email Templates**
2. Select **Reset password**
3. Customize the template as needed
4. Make sure the `{{ .ConfirmationURL }}` placeholder is included

## Step 4: Redeploy Your Application

After adding the environment variable, you need to redeploy:

### Option A: Automatic Deployment
- Push any change to your GitHub repository
- Vercel will automatically redeploy with the new environment variable

### Option B: Manual Deployment
1. Go to your Vercel dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click the three dots (**...**) on the latest deployment
5. Click **Redeploy**

## Step 5: Test the Features

### Test Sign-Up
1. Visit your deployed app: `https://your-app-name.vercel.app/login`
2. Click **Sign Up**
3. Enter email and password
4. Check your email for verification link
5. Click verification link
6. Sign in with your new account

### Test Password Reset
1. Visit: `https://your-app-name.vercel.app/login`
2. Click **Forgot password?**
3. Enter your email
4. Check your email for reset link
5. Click reset link
6. Enter new password
7. Sign in with new password

## Troubleshooting

### Environment Variable Not Working
- Make sure you redeployed after adding the variable
- Check that the variable name is exactly `NEXT_PUBLIC_APP_URL` (case-sensitive)
- Verify all environments are selected (Production, Preview, Development)

### Email Not Arriving
- Check spam/junk folder
- Verify Supabase email service is enabled
- Check Supabase logs: **Authentication** → **Logs**

### Redirect Not Working
- Verify redirect URLs in Supabase match your Vercel URL exactly
- Make sure to include both `/login` and `/reset-password` routes
- URLs must use HTTPS (not HTTP)

### 404 Error on Reset Password Page
- Ensure the code is deployed (check latest deployment)
- Verify `app/reset-password/page.tsx` exists in your repository
- Clear browser cache and try again

## Security Notes

- Never commit `.env.local` to GitHub (it's already in `.gitignore`)
- Keep your Supabase service role key secret
- Only add trusted email addresses as admins
- Monitor Supabase logs for suspicious activity
- Enable rate limiting if you experience abuse

## Next Steps

After setup is complete:
1. Create your first admin account via sign-up
2. Verify your email
3. Sign in to the dashboard
4. Share the sign-up link with other admins
5. Instruct them to verify their emails before signing in

## Support

For issues with:
- **Vercel deployment**: Check Vercel build logs
- **Supabase authentication**: Check Supabase logs and documentation
- **Email delivery**: Contact Supabase support

---

**Done!** Your Blue Gym authentication system is now fully configured and deployed. 🎉
