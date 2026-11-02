# Blue Gym - Command Prompt Quick Start

## ⚡ Quick Installation (Using Batch Scripts)

We've created batch files to make this super easy in Command Prompt!

### Step 1: Run Installation Script

**Double-click** `install.bat` in the project folder

OR

Run this in Command Prompt:
```cmd
install.bat
```

**What it does:**
- ✅ Removes old `node_modules`
- ✅ Removes `package-lock.json`
- ✅ Runs fresh `npm install`

### Step 2: Start Development Server

**Double-click** `dev.bat` in the project folder

OR

Run this in Command Prompt:
```cmd
dev.bat
```

### Step 3: Open in Browser

Visit: **http://localhost:3000**

### Step 4: Login

- **Email**: admin@bluegym.com
- **Password**: password123

---

## 📋 Manual Commands (if needed)

If you prefer to run commands manually in Command Prompt:

### Clean Install
```cmd
cd C:\Users\terre\Desktop\Blue Gym\blue-gym

REM Remove old files
rmdir /s /q node_modules
del package-lock.json

REM Fresh install
npm install
```

### Run Dev Server
```cmd
npm run dev
```

### Build for Production
```cmd
npm run build
```

### Start Production Server
```cmd
npm start
```

---

## 🆘 If npm install Fails

Try this command:
```cmd
npm install --legacy-peer-deps
```

---

## 🗂️ Project Files

```
blue-gym/
├── install.bat          ← Run this to install
├── dev.bat              ← Run this to start dev server
├── app/                 ← All your pages and API routes
├── components/          ← Reusable UI components
├── lib/                 ← Utilities and types
├── package.json         ← Dependencies
└── tailwind.config.ts   ← Styling config
```

---

## 💡 Tips

1. **Keep Command Prompt Open**: The dev server needs to keep running. Open a new Command Prompt window to run other commands.

2. **Changes Auto-Reload**: While dev server is running, changes to files are automatically refreshed in the browser.

3. **Stop Server**: Press `Ctrl+C` in Command Prompt to stop the dev server.

4. **Port Already in Use**: If port 3000 is busy, run:
   ```cmd
   npm run dev -- -p 3001
   ```

---

## ✨ What You'll See

After running `dev.bat`, you should see:

```
> blue-gym@0.1.0 dev
> next dev

  ▲ Next.js 16.4.3
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

Then open http://localhost:3000 in your browser!

---

## 🚀 Ready to Go!

1. Double-click `install.bat` → Wait for completion
2. Double-click `dev.bat` → Keep it running
3. Open http://localhost:3000 → Login!

**That's it!** 🎉
