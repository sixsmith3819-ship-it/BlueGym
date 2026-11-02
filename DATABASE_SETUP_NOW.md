# 🗄️ Database Setup - Fix "Table Not Found" Error

## The Issue
You're seeing: **"Could not find the table 'public.members' in the schema cache"**

This means the database tables haven't been created yet in your Supabase project.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Login to your account
3. Select your project: **iznmntprmauzutzwoehf**

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"+ New query"** button (top right)

### Step 3: Copy the SQL Schema
1. Open the file: `SUPABASE_SETUP.sql` (in your project root)
2. **Select ALL the text** (Ctrl+A)
3. **Copy it** (Ctrl+C)

### Step 4: Paste and Run
1. **Paste** the SQL into the Supabase SQL Editor (Ctrl+V)
2. Click **"Run"** button (or press Ctrl+Enter)
3. Wait for "Success. No rows returned" message

### Step 5: Verify Tables Created
1. Click **"Table Editor"** in the left sidebar
2. You should now see 4 tables:
   - ✅ `gym_settings`
   - ✅ `members`
   - ✅ `payments`
   - ✅ `subscriptions`

### Step 6: Refresh Your App
1. Go back to your Blue Gym app
2. Refresh the page (F5 or Ctrl+R)
3. Navigate to **Members** page
4. Should now work! ✅

---

## 📋 What Gets Created

### 4 Main Tables:

#### 1. **members** (Member profiles)
```sql
- id (UUID)
- member_id (BGM202611001) - Auto-generated
- full_name
- phone_number
- registration_date
- is_active
```

#### 2. **payments** (Payment records)
```sql
- id (UUID)
- receipt_number (RCP20261102000001)
- verification_token (for QR codes)
- member_id (link to member)
- amount_paid
- payment_method
- payment_date
- subscription_start_date
- subscription_end_date
```

#### 3. **subscriptions** (Active subscriptions)
```sql
- id (UUID)
- member_id
- payment_id
- start_date
- end_date
- is_active
```

#### 4. **gym_settings** (App configuration)
```sql
- gym_name
- monthly_subscription_fee
- currency
- expiry_warning_days
```

### Plus:
- ✅ Indexes for fast queries
- ✅ Foreign key constraints
- ✅ Row Level Security (RLS)
- ✅ Helper functions
- ✅ Default gym settings

---

## 🎯 Quick Visual Guide

```
Supabase Dashboard
    ↓
SQL Editor (left sidebar)
    ↓
New Query (top right)
    ↓
Paste SUPABASE_SETUP.sql
    ↓
Click "Run"
    ↓
See "Success. No rows returned"
    ↓
Check Table Editor
    ↓
See 4 tables created ✅
```

---

## 🔍 Troubleshooting

### Problem: "Permission denied" error
**Solution:** Your user account should have full permissions. If not:
1. Go to **Settings** → **Database**
2. Check you're the project owner
3. Or use the Supabase service role key

### Problem: "Table already exists" error
**Solution:** This is fine! It means tables were partially created.
- The SQL uses `CREATE TABLE IF NOT EXISTS`
- It won't overwrite existing tables
- Just means some parts already ran

### Problem: "Syntax error" message
**Solution:** 
1. Make sure you copied the ENTIRE SQL file
2. Don't modify the SQL
3. Paste it all at once
4. Click Run once

### Problem: Tables created but still get error
**Solution:**
1. Hard refresh your app: **Ctrl + Shift + R**
2. Restart dev server:
   ```cmd
   # Press Ctrl+C to stop
   dev.bat
   ```
3. Clear browser cache
4. Check `.env.local` has correct Supabase URL

---

## ✅ Verification Checklist

After running the SQL, verify:

### In Supabase Dashboard:
- [ ] Table Editor shows 4 tables
- [ ] Click on `members` table - should show columns
- [ ] Click on `payments` table - should show columns
- [ ] Click on `subscriptions` table - should show columns
- [ ] Click on `gym_settings` table - should have 1 default row

### In Your App:
- [ ] Members page loads (no error)
- [ ] Can see "Add New Member" form
- [ ] Dashboard shows stats (0 if no data)
- [ ] Payments page loads
- [ ] No "table not found" errors

---

## 🎉 What You Can Do After Setup

### Test the System:
1. **Register a member:**
   - Go to Members page
   - Click "Add New Member"
   - Fill in details
   - Submit form
   - Member ID auto-generated (e.g., BGM202611001)

2. **Record a payment:**
   - Go to Payments page
   - Select the member you created
   - Enter amount ($20)
   - Choose payment method
   - Confirm payment
   - Receipt generated with QR code

3. **Verify the QR code:**
   - Scan the QR code
   - Or visit the verification URL
   - See membership status

4. **Check dashboard:**
   - View statistics updated
   - See recent payment
   - Check revenue chart

---

## 📖 SQL File Location

The SQL file is in your project root:
```
blue-gym/
  └── SUPABASE_SETUP.sql  👈 Copy this file's content
```

Or view it in your code editor and copy all the text.

---

## 🚀 Quick Copy-Paste Instructions

**1. Open Supabase:** https://supabase.com/dashboard

**2. SQL Editor → New Query**

**3. Copy this entire file:** `SUPABASE_SETUP.sql`

**4. Paste and Run**

**5. Done!** ✅

---

## 💡 Pro Tips

### After Setup:
- Tables are empty initially (0 members, 0 payments)
- This is normal - start adding members!
- Dashboard will show zeros until you add data
- Default gym settings are pre-loaded

### Database Features:
- **Auto-generated IDs:** Member IDs and receipt numbers
- **Foreign keys:** Payments linked to members
- **Indexes:** Fast search and queries
- **RLS:** Only authenticated users can access
- **Helper functions:** Automatic date calculations

---

## ❓ Still Having Issues?

### Check These:

**1. Supabase Project Active?**
- Go to Supabase Dashboard
- Check project isn't paused
- Green status indicator

**2. Correct Project?**
- URL matches: `iznmntprmauzutzwoehf.supabase.co`
- Same project as in `.env.local`

**3. SQL Ran Successfully?**
- Should see "Success" message
- No red error messages
- Tables visible in Table Editor

**4. App Configuration?**
- `.env.local` has correct URL and keys
- Dev server restarted after setup
- Browser cache cleared

---

## 🎯 Final Checklist

Before you can use the app:
- [ ] SQL script run in Supabase
- [ ] 4 tables created and visible
- [ ] Dev server running
- [ ] Browser refreshed
- [ ] Members page loads without error
- [ ] Ready to add your first member!

---

**Run the SQL now and your app will work perfectly!** 🚀

**Estimated time:** 5 minutes
**Difficulty:** Easy (copy-paste SQL)
**Result:** Fully functional database ✅
