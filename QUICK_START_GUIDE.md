# ⚡ Blue Gym - Quick Start Guide

## 🚀 First Time Setup (5 minutes)

### Step 1: Install Dependencies
```cmd
install.bat
```

### Step 2: Configure Supabase
1. Create Supabase account at https://supabase.com
2. Create new project
3. Copy your project URL and API keys
4. Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Step 3: Setup Database
1. Go to Supabase SQL Editor
2. Copy contents from `SUPABASE_SETUP.sql`
3. Paste and run in SQL Editor
4. Verify tables created (members, payments, subscriptions, gym_settings)

### Step 4: Run Application
```cmd
dev.bat
```

**Note:** The dev.bat file automatically uses Webpack (not Turbopack) for better Windows compatibility.

### Step 5: Access Dashboard
Open browser: http://localhost:3000/dashboard

---

## 📋 Common Tasks

### Register a New Member

1. **Navigate:** Dashboard → Members → Add New Member
2. **Fill in:**
   - Full Name (required)
   - Phone Number (required)
   - Emergency Contact (required)
   - Date of Birth (required)
   - Email (optional)
   - Address (optional)
3. **Click:** "Register Member"
4. **Result:** Toast confirmation + unique member ID generated

**Example:**
```
Full Name: John Doe
Phone: +263 77 123 4567
Emergency: +263 77 987 6543
DOB: 1990-01-15
Email: john@example.com
```

---

### Record a Payment

1. **Navigate:** Dashboard → Payments → Record Payment
2. **Select:** Member from dropdown
3. **Enter:** Amount (default $20)
4. **Choose:** Payment method:
   - Cash
   - EcoCash
   - Bank Transfer
   - Other
5. **Click:** "Continue to Confirmation"
6. **Review:** Payment details and subscription dates
7. **Click:** "Confirm Payment"
8. **Result:** Digital receipt with QR code generated

**Subscription Logic:**
- Start Date: Today
- End Date: Last day of current month
- Example: Payment on Nov 15 → Expires Nov 30

---

### Verify a Receipt

#### Method 1: Scan QR Code
1. Open receipt with QR code
2. Use any QR scanner app
3. Opens verification page automatically

#### Method 2: Manual URL
1. Visit: `http://localhost:3000/verify/[token]`
2. Replace `[token]` with verification token

**Status Colors:**
- 🟢 **Green** = Active subscription (valid)
- 🟠 **Orange** = Expired subscription (needs renewal)
- 🔴 **Red** = Invalid/inactive (check member status)

---

### View Dashboard Statistics

1. **Navigate:** Dashboard → Home
2. **View Stats:**
   - Total Members
   - Active Memberships
   - Expiring Soon (next 3 days)
   - Monthly Revenue

3. **View Charts:**
   - Revenue Overview (Daily/Weekly/Monthly)
   - Toggle period with buttons

4. **View Lists:**
   - Recent Payments (last 5)
   - Expiring Memberships (next 3 days)

5. **Quick Actions:**
   - Register Member
   - Record Payment
   - Scan QR Code
   - View Reports

---

## 🔧 Development Commands

### Start Development Server
```cmd
dev.bat
```
or
```cmd
npm run dev
```

### Build for Production
```cmd
npm run build
```

### Run Production Server
```cmd
npm start
```

### Lint Code
```cmd
npm run lint
```

---

## 📁 File Locations

### Add/Edit Components:
```
components/
├── ui/              → Reusable UI components
├── members/         → Member-related components
├── payments/        → Payment-related components
├── dashboard/       → Dashboard components
└── verification/    → Verification components
```

### Add/Edit Pages:
```
app/
├── dashboard/       → Dashboard pages
│   ├── members/    → /dashboard/members
│   ├── payments/   → /dashboard/payments
│   └── reports/    → /dashboard/reports
└── verify/         → /verify/[token]
```

### Add/Edit API Routes:
```
app/api/
├── members/         → /api/members
├── payments/        → /api/payments
└── dashboard/       → /api/dashboard/*
```

### Configure Styles:
```
app/globals.css      → Global styles & animations
tailwind.config.ts   → Tailwind configuration
```

---

## 🎨 Using UI Components

### Button
```tsx
import Button from '@/components/ui/Button'

<Button variant="primary" size="lg" isLoading={loading}>
  Click Me
</Button>
```

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `danger`
**Sizes:** `sm`, `md`, `lg`

---

### Toast Notifications
```tsx
import { useToast } from '@/components/ui/ToastContainer'

const { showToast } = useToast()

// Success
showToast('Payment recorded!', 'success')

// Error
showToast('Failed to load data', 'error')

// Warning
showToast('Membership expiring soon', 'warning')

// Info
showToast('New feature available', 'info')
```

---

### Loading Skeletons
```tsx
import { StatCardSkeleton, PaymentCardSkeleton } from '@/components/ui/Skeleton'

{isLoading ? (
  <StatCardSkeleton />
) : (
  <StatCard {...data} />
)}
```

**Available Skeletons:**
- `StatCardSkeleton` - For stat cards
- `PaymentCardSkeleton` - For payment items
- `TableRowSkeleton` - For list items

---

### Empty States
```tsx
import EmptyState from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'

{items.length === 0 && (
  <EmptyState
    icon={Users}
    title="No Members Yet"
    description="Get started by registering your first member."
    actionLabel="Add Member"
    onAction={() => router.push('/dashboard/members')}
    variant="default"
  />
)}
```

**Variants:** `default`, `success`, `warning`, `error`

---

## 🗄️ Database Queries

### Get All Active Members
```sql
SELECT * FROM members 
WHERE is_active = true 
ORDER BY created_at DESC;
```

### Get Today's Payments
```sql
SELECT * FROM payments 
WHERE payment_date = CURRENT_DATE 
ORDER BY created_at DESC;
```

### Get Expiring Subscriptions
```sql
SELECT m.*, s.end_date 
FROM members m
JOIN subscriptions s ON m.id = s.member_id
WHERE s.is_active = true 
AND s.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
ORDER BY s.end_date ASC;
```

### Get Monthly Revenue
```sql
SELECT SUM(amount_paid) as total_revenue
FROM payments
WHERE EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE)
AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE);
```

---

## 🔐 Environment Variables

### Required Variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=              # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=         # Public/anonymous key
SUPABASE_SERVICE_ROLE_KEY=             # Service role key (keep secret!)

# App Configuration
NEXT_PUBLIC_APP_URL=                   # Your app URL (dev/prod)
```

### Where to Find Supabase Keys:
1. Go to Supabase dashboard
2. Select your project
3. Settings → API
4. Copy URL and keys

---

## 🐛 Quick Troubleshooting

### Problem: Can't connect to database
**Solution:**
1. Check `.env.local` has correct Supabase credentials
2. Verify Supabase project is active
3. Check RLS policies are enabled

### Problem: QR codes not generating
**Solution:**
1. Check `qrcode` package is installed
2. Verify payment record was created
3. Check verification_token exists in database

### Problem: Toasts not showing
**Solution:**
1. Verify `ToastProvider` is in root layout
2. Check `useToast` hook is inside provider
3. Verify import path is correct

### Problem: Animations not working
**Solution:**
1. Check `globals.css` has animation keyframes
2. Verify Tailwind config includes animations
3. Check browser supports CSS animations

### Problem: Dev server won't start
**Solution:**
```cmd
# Kill any process using port 3000
netstat -ano | findstr :3000
taskkill /PID [process_id] /F

# Restart server
dev.bat
```

### Problem: Turbopack error on Windows
**Solution:**
The `dev.bat` file already handles this by using Webpack. If you still see the error:
```cmd
# Run with webpack flag explicitly
npm run dev -- --webpack
```
See [TURBOPACK_FIX.md](TURBOPACK_FIX.md) for details.

---

## 📊 Data Flow

### Payment Recording Flow:
```
1. User selects member
2. Enters amount and payment method
3. Confirms payment details
4. API creates payment record
5. API creates subscription record
6. API generates verification token
7. Receipt displayed with QR code
```

### Verification Flow:
```
1. User scans QR code
2. Opens /verify/[token] URL
3. API fetches payment by token
4. API checks subscription status
5. Displays status (green/orange/red)
6. Shows member and payment details
```

### Dashboard Stats Flow:
```
1. Page loads
2. Shows skeleton loaders
3. Fetches stats from API
4. Updates stat cards
5. Fetches revenue data
6. Renders chart
7. Fetches recent data
8. Updates lists
```

---

## 🎯 Best Practices

### Member Management:
- ✅ Verify phone numbers before saving
- ✅ Always collect emergency contact
- ✅ Keep member status updated
- ✅ Use search to find members quickly

### Payment Recording:
- ✅ Double-check member selection
- ✅ Verify amount before confirming
- ✅ Save receipt for member records
- ✅ Record payment method accurately

### Receipt Verification:
- ✅ Test QR codes after generation
- ✅ Ensure QR scanner has camera access
- ✅ Keep verification tokens secure
- ✅ Check status color coding

### Dashboard Usage:
- ✅ Check expiring memberships daily
- ✅ Monitor revenue trends
- ✅ Follow up on expired memberships
- ✅ Use quick actions for efficiency

---

## 🚀 Deployment Checklist

### Before Deploying:
- [ ] Test all features locally
- [ ] Verify database connections
- [ ] Check environment variables
- [ ] Test on mobile devices
- [ ] Review error handling
- [ ] Test QR code generation
- [ ] Verify receipt verification
- [ ] Check dashboard statistics

### Production Setup:
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Enable Supabase production mode
- [ ] Configure custom domain
- [ ] Setup SSL certificate
- [ ] Configure CORS if needed
- [ ] Enable error logging
- [ ] Setup backups

---

## 📞 Quick Reference Links

### Local URLs:
- Dashboard: http://localhost:3000/dashboard
- Members: http://localhost:3000/dashboard/members
- Payments: http://localhost:3000/dashboard/payments
- Reports: http://localhost:3000/dashboard/reports
- Login: http://localhost:3000/login

### Documentation:
- `README.md` - Main README
- `PROJECT_COMPLETE.md` - Complete project overview
- `PHASE_*_COMPLETE.md` - Phase-specific docs
- `SUPABASE_SETUP.sql` - Database schema

### External Resources:
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Docs: https://react.dev

---

## 💡 Pro Tips

1. **Use keyboard shortcuts:**
   - Ctrl+K to open search (coming soon)
   - Tab to navigate forms
   - Enter to submit forms

2. **Member ID format:**
   - Auto-generated: `GYM-XXXXX`
   - Sequential numbering
   - Unique per member

3. **Receipt numbers:**
   - Format: `RCP-{timestamp}-{random}`
   - Unique per payment
   - Used for tracking

4. **Subscription logic:**
   - Calendar-month based
   - Fairer than 30-day periods
   - Example: Nov 15 payment expires Nov 30

5. **Performance:**
   - Dashboard loads in ~2 seconds
   - Smooth animations at 60fps
   - Optimized for mobile

---

## ✅ Quick Test Checklist

After setup, verify these work:
- [ ] Can register a member
- [ ] Can record a payment
- [ ] Receipt generates with QR code
- [ ] QR code verifies correctly
- [ ] Dashboard shows statistics
- [ ] Search works in member list
- [ ] Toasts show on actions
- [ ] Loading states display
- [ ] Empty states show when needed
- [ ] Responsive on mobile

---

**That's it! You're ready to manage your gym! 🎉**

For detailed information, check `PROJECT_COMPLETE.md`.
For issues, see troubleshooting section above.
