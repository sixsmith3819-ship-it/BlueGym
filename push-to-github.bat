@echo off
echo.
echo ============================================
echo   Blue Gym - Push to GitHub
echo ============================================
echo.
echo This will push your project to GitHub
echo Repository: https://github.com/Guruzzz/Blue-Gym
echo.
pause
echo.

echo Step 1: Initializing Git repository...
git init
echo.

echo Step 2: Adding remote repository...
git remote add origin https://github.com/Guruzzz/Blue-Gym.git
echo.

echo Step 3: Adding all files...
git add .
echo.

echo Step 4: Creating first commit...
git commit -m "Initial commit: Blue Gym Management System v1.0.0"
echo.

echo Step 5: Renaming branch to main...
git branch -M main
echo.

echo Step 6: Pushing to GitHub...
git push -u origin main
echo.

echo ============================================
echo   Push Complete!
echo ============================================
echo.
echo Your project is now on GitHub:
echo https://github.com/Guruzzz/Blue-Gym
echo.
pause
