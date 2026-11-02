@echo off
REM Blue Gym - Installation Script for Command Prompt

echo.
echo ============================================
echo   Blue Gym - Fresh Installation
echo ============================================
echo.

REM Remove old node_modules
echo Cleaning up old installation...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ Removed node_modules
) else (
    echo ✓ node_modules not found (OK)
)

REM Remove package-lock.json
if exist package-lock.json (
    del package-lock.json
    echo ✓ Removed package-lock.json
) else (
    echo ✓ package-lock.json not found (OK)
)

echo.
echo ============================================
echo   Installing Dependencies
echo ============================================
echo.

REM Run npm install
npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   ✓ Installation Successful!
    echo ============================================
    echo.
    echo Next steps:
    echo   1. Run: npm run dev
    echo   2. Visit: http://localhost:3000
    echo   3. Login with:
    echo      - Email: admin@bluegym.com
    echo      - Password: password123
    echo.
) else (
    echo.
    echo ============================================
    echo   ✗ Installation Failed
    echo ============================================
    echo.
    echo Try this command instead:
    echo   npm install --legacy-peer-deps
    echo.
)

pause
