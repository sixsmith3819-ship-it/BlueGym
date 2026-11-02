# Phase 2 - Supabase Database Setup

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in details:
   - **Project Name**: Blue Gym
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
5. Click "Create New Project" (takes ~2 minutes)

## Step 2: Get Your Credentials

After project creation:

1. Go to **Settings → API** in Supabase dashboard
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Update Environment Variables

Update `.env.local` in your project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy ALL content from `SUPABASE_SETUP.sql` (in this project)
4. Paste into the SQL editor
5. Click **Run** (play button)
6. Wait for completion ✓

You'll see these tables created:
- `gym_settings`
- `members`
- `payments`
- `subscriptions`

## Step 5: Set Up Authentication

### Create Admin User

1. In Supabase, go to **Authentication → Users**
2. Click **New User**
3. Fill in:
   - **Email**: admin@bluegym.com
   - **Password**: Choose a strong password (different from the one you'll use for login)
   - Check: "Auto confirm user"
4. Click **Create User**

### Update Auth Settings

1. Go to **Authentication → Providers**
2. Make sure **Email** is enabled
3. Go to **Authentication → Policies**
4. Enable the default policies

## Step 6: Configure Auth in Your App

The app already has auth configured! But we need to update it to use Supabase.

### Update `.env.local`

Make sure you have:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 7: Test Connection

1. Start your dev server: `npm run dev`
2. Visit: http://localhost:3000
3. Try logging in with: admin@bluegym.com / (the password you created)

If you get an error, check:
- Environment variables are correct
- Supabase project is running
- SQL queries were executed successfully

## Troubleshooting

### "Cannot read property 'data' of undefined"
- Check `.env.local` has correct URLs and keys
- Restart dev server after updating `.env.local`

### "Row Level Security" errors
- This is expected for now - Phase 2 backend will handle this

### "relation 'public.members' does not exist"
- The SQL query didn't run successfully
- Try running SUPABASE_SETUP.sql again

### Can't log in
- Make sure user was created in Supabase
- Check password is correct
- Try creating a new user

## What's Next

After Supabase is set up, we'll create:
1. Member registration form
2. API routes for CRUD operations
3. Member management dashboard
4. Payment recording system

## Database Schema

```
gym_settings
  ├─ id (UUID)
  ├─ gym_name
  ├─ monthly_subscription_fee
  ├─ currency
  ├─ expiry_warning_days
  └─ contact_information

members
  ├─ id (UUID)
  ├─ member_id (unique, human-readable)
  ├─ full_name
  ├─ phone_number
  ├─ registration_date
  └─ is_active

payments
  ├─ id (UUID)
  ├─ receipt_number (unique)
  ├─ verification_token (unique)
  ├─ member_id (FK)
  ├─ amount_paid
  ├─ payment_method
  ├─ payment_date
  ├─ subscription_start_date
  ├─ subscription_end_date
  └─ payment_status

subscriptions
  ├─ id (UUID)
  ├─ member_id (FK)
  ├─ payment_id (FK)
  ├─ start_date
  ├─ end_date
  └─ is_active
```

## Security Notes

✅ Row Level Security (RLS) enabled on all tables  
✅ Only authenticated users can access  
✅ Service role key only used server-side  
✅ Public verification endpoint will be separate  
✅ Input validation on all API routes  
✅ CSRF protection enabled  

---

**Next**: Implement Member Management API
