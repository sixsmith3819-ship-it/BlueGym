# QR Code Not Working - Fix Guide

## Problem
When scanning the QR code on receipts, it's not working because the `NEXT_PUBLIC_APP_URL` environment variable is missing or incorrect.

## What Was Fixed

### 1. Updated Verification Page
- Fixed Next.js 15+ compatibility issue with `params`
- Added error logging for debugging
- File: `app/verify/[token]/page.tsx`

### 2. Added APP_URL to Local Environment
- Added `NEXT_PUBLIC_APP_URL` to `.env.local`
- Currently set to: `https://blue-gym-iota.vercel.app`

## Steps to Fix on Vercel

### Step 1: Find Your Vercel URL
1. Go to https://vercel.com/dashboard
2. Click on your **BlueGym** project
3. Look at the top - you'll see your deployment URL (e.g., `blue-gym-xyz.vercel.app`)
4. Copy this URL

### Step 2: Update Environment Variable on Vercel
1. In your Vercel project, click **Settings**
2. Click **Environment Variables** in the sidebar
3. Look for `NEXT_PUBLIC_APP_URL`
   - If it exists, click **Edit** and update the value
   - If it doesn't exist, click **Add New**

4. Set:
   - **Name**: `NEXT_PUBLIC_APP_URL`
   - **Value**: `https://your-actual-vercel-url.vercel.app`
   - Select all environments (Production, Preview, Development)

5. Click **Save**

### Step 3: Redeploy
After adding/updating the environment variable:

**Option A: Push to GitHub (Recommended)**
```bash
cd blue-gym
git add .
git commit -m "Update configuration"
git push origin main
```
This will trigger automatic redeployment with the new environment variable.

**Option B: Manual Redeploy**
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click the three dots (...) on the latest deployment
4. Click **Redeploy**

### Step 4: Test the QR Code
1. After redeployment completes (2-3 minutes)
2. Go to your app → Payments page
3. Record a new payment (this will generate a new QR code)
4. Scan the QR code with your phone
5. It should now open the verification page showing:
   - Member name
   - Payment amount
   - Subscription status
   - Expiry date

## Troubleshooting

### QR Code Still Not Working

**Issue 1: Wrong URL Format**
- ❌ Wrong: `blue-gym-xyz.vercel.app` (missing https://)
- ❌ Wrong: `http://blue-gym-xyz.vercel.app` (http instead of https)
- ✅ Correct: `https://blue-gym-xyz.vercel.app`

**Issue 2: Environment Variable Not Applied**
- Make sure you redeployed after adding the variable
- Check deployment logs to confirm the variable is loaded
- In Vercel, go to Deployments → Latest → View Function Logs

**Issue 3: Old QR Codes**
- QR codes generated BEFORE the fix will have the wrong URL
- Generate a new payment receipt after the fix is deployed
- Old receipts will need to be regenerated

**Issue 4: QR Code Points to localhost**
- This happens if the environment variable wasn't set when the QR was generated
- Solution: Regenerate the receipt after fixing the environment variable

### How to Check the QR Code URL

1. Use a QR scanner app that shows the URL before opening it
2. The URL should look like: `https://your-app.vercel.app/verify/XXXXXXXXX-XXXXX`
3. If it shows `http://localhost:3000/verify/...`, the environment variable wasn't set

## Testing Locally

To test QR codes on your local development server:

1. Open `.env.local`
2. Temporarily change:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

4. Generate a test payment
5. The QR code will point to localhost
6. Open the URL in your browser on the same computer

**Note:** You won't be able to scan localhost QR codes with your phone unless:
- Your phone is on the same WiFi network
- You use your computer's local IP address (e.g., `http://192.168.1.100:3000`)

## What Your Actual Vercel URL Might Be

Based on common patterns, your URL is likely one of these:
- `https://blue-gym.vercel.app`
- `https://blue-gym-iota.vercel.app`
- `https://blue-gym-[username].vercel.app`
- `https://blue-gym-git-main-[username].vercel.app`

**To find it for sure:**
1. Go to https://vercel.com/dashboard
2. Click your project
3. The URL is shown at the top of the project page

## Summary

✅ **Fixed:** Verification page compatibility issue  
✅ **Added:** Local environment variable  
⏳ **Needs:** Vercel environment variable update  
⏳ **Then:** Redeploy application  
⏳ **Finally:** Test with new QR code  

Once you complete Steps 1-4 above, your QR codes will work perfectly! 🎉
