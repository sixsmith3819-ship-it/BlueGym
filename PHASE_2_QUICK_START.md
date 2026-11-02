# Phase 2 - Quick Start Guide

## 🎯 What You Need to Do (3 Simple Steps)

### Step 1: Set Up Supabase (5 minutes)

1. Go to **[supabase.com](https://supabase.com)**
2. Click **New Project**
3. Fill in:
   - Project Name: `Blue Gym`
   - Database Password: (anything strong)
   - Region: Pick closest to you
4. Click **Create New Project** (wait 2 minutes)
5. Go to **Settings → API** and copy:
   - Project URL
   - `anon public` key
   - `service_role secret` key

### Step 2: Create Database Tables (2 minutes)

1. In Supabase → **SQL Editor**
2. Click **New Query**
3. Open file: `SUPABASE_SETUP.sql` (in your project folder)
4. Copy ALL the SQL
5. Paste into Supabase SQL editor
6. Click **Run** button

Done! You now have:
- members table
- payments table
- subscriptions table
- gym_settings table

### Step 3: Update Environment Variables (1 minute)

1. Open file: `.env.local`
2. Update these values (from Supabase API settings):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

3. Save file
4. Restart dev server:
   ```bash
   npm run dev
   ```

---

## ✅ That's It!

You now have:
- ✅ Complete database
- ✅ Member registration
- ✅ Payment system backend
- ✅ Subscription logic

---

## 🧪 Test It

1. Visit: **http://localhost:3000/dashboard/members**

2. Register a test member:
   - Name: John Doe
   - Phone: 271234567

3. Click **Register Member**

4. You should see:
   - ✅ Success message
   - ✅ Member ID created
   - ✅ Member in list

---

## 📁 What Files Do What

| File | Purpose |
|------|---------|
| `SUPABASE_SETUP.sql` | Database schema - execute in Supabase |
| `PHASE_2_SUPABASE_GUIDE.md` | Detailed setup instructions |
| `PHASE_2_STATUS.md` | Complete feature list & checklist |
| `/api/members` | Member API endpoints |
| `/api/payments` | Payment API endpoints |
| `MemberRegistrationForm.tsx` | Registration form component |
| `MembersList.tsx` | Members list component |

---

## 🚨 If Something Doesn't Work

### Members won't register
1. Check `.env.local` has correct URLs
2. Check Supabase project is running
3. Check SQL schema was executed
4. Restart dev server

### No members appear
1. Make sure database tables exist (check Supabase)
2. Check environment variables
3. Look at browser console for errors

### "API not found"
1. Restart dev server
2. Check `.env.local` is saved

---

## 📊 What You Can Now Do

✅ Register new members  
✅ Search members  
✅ Filter by active/inactive  
✅ Auto-generate member IDs  
✅ Record payments (backend ready)  
✅ Calculate subscription dates  
✅ Generate receipt numbers  

---

## 🚀 Next: Phase 3

After you've tested member registration:
1. Payment recording form
2. QR code receipt generation
3. Receipt PDF download
4. Public verification page

---

## 📞 Reference

- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org
- Questions? Check `PHASE_2_SUPABASE_GUIDE.md`

---

**You're all set! 🎉**

Go to `/dashboard/members` and register your first member!
