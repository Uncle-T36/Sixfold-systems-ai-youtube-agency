@echo off
echo ================================================
echo   AI YouTube Agency - Production Deployment
echo ================================================
echo.

cd /d "c:\Users\tchaf\OneDrive\Desktop\SixFold Systems\ai_youtube_agency"

echo Step 1: Removing old .git folder...
if exist .git (
    rmdir /s /q .git
    echo    Old git history removed
) else (
    echo    No existing .git folder
)

echo.
echo Step 2: Initializing fresh repository...
git init
git branch -M main
echo    Repository initialized

echo.
echo Step 3: Adding all files...
git add .
echo    Files staged

echo.
echo Step 4: Creating commit...
git commit -m "Production-ready AI YouTube Agency with crash prevention"
echo    Commit created

echo.
echo Step 5: Adding remote...
git remote add origin https://github.com/Uncle-T36/sixfold-systems-ai-youtube-agency.git 2>nul
echo    Remote added

echo.
echo Step 6: Pushing to GitHub...
git push -u origin main --force

echo.
echo ================================================
echo   DEPLOYMENT COMPLETE!
echo ================================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com/new
echo 2. Import: Uncle-T36/sixfold-systems-ai-youtube-agency
echo 3. Add GROQ_API_KEY environment variable
echo 4. Deploy!
echo.
pause
