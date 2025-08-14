@echo off
echo 🚀 ManagAI Go Server - Deploy to GitHub
echo =====================================

echo.
echo 📊 Git status:
git status

echo.
echo 📁 Adding files...
git add .

echo.
set /p commitMessage="💬 Enter commit message (or press Enter for default): "
if "%commitMessage%"=="" set commitMessage=Add Go server for AWS App Runner deployment

echo.
echo 💾 Committing with message: %commitMessage%
git commit -m "%commitMessage%"

echo.
echo 📤 Pushing to GitHub...
git push origin main

echo.
echo ✅ Successfully pushed to GitHub!
echo.
echo 🌐 Next steps:
echo 1. Create AWS App Runner service
echo 2. Connect to your GitHub repository
echo 3. Set environment variables (CRON_SECRET, MANAGAI_ORG_ID)
echo 4. Deploy!
echo.
pause
