@echo off
echo.
echo ============================================
echo   Blue Gym - Fixing Tailwind CSS
echo ============================================
echo.
echo This will reinstall dependencies with Tailwind v3...
echo.

echo Step 1: Removing node_modules...
rmdir /s /q node_modules
del package-lock.json

echo.
echo Step 2: Installing dependencies...
call npm install

echo.
echo Step 3: Clearing Next.js cache...
rmdir /s /q .next

echo.
echo ============================================
echo   Tailwind CSS Fixed!
echo ============================================
echo.
echo Now run: dev.bat
echo.
pause
