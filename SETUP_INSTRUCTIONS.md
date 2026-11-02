# Blue Gym - Setup Instructions

## ✅ Fixed Dependency Issue

The `qrcode.react` package is incompatible with React 19. This has been fixed by using the modern `qrcode` package instead.

**Updated in `package.json`:**
```json
- "qrcode.react": "^1.0.1"    ❌ (React 15-17 only)
+ "qrcode": "^1.5.3"           ✅ (React 19 compatible)
```

## Installation Steps

### 1. Clean Install (Recommended)

If npm install failed before, run this to start fresh:

```bash
cd "c:\Users\terre\Desktop\Blue Gym\blue-gym"

# Remove old installation files
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Fresh install
npm install
```

### 2. Run Development Server

Once installation is complete:

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 3. Login

- **Email**: admin@bluegym.com
- **Password**: password123

## Troubleshooting

### If npm install still fails:
Use the legacy peer deps flag:
```bash
npm install --legacy-peer-deps
```

### If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

### To clear Next.js cache:
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

## What's Included

✅ Next.js 16 with TypeScript  
✅ Tailwind CSS v4  
✅ Supabase integration ready  
✅ Modern dark UI design system  
✅ Responsive mobile-first layout  
✅ Authentication pages  
✅ Component library  
✅ All dependencies compatible with React 19  

## Environment Variables

Create `.env.local` with Supabase credentials (optional for now):

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
```

---

**Ready to develop!** 🚀
