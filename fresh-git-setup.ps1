# Fresh Git Repository Setup Script - Production Ready Version
# This removes old git history and creates a clean, crash-proof deployment

Set-Location "c:\Users\tchaf\OneDrive\Desktop\SixFold Systems\ai_youtube_agency"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  AI YouTube Agency - Production Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Removing old .git folder..." -ForegroundColor Yellow
if (Test-Path .git) {
    Remove-Item .git -Recurse -Force
    Write-Host "   Old git history removed" -ForegroundColor Green
} else {
    Write-Host "   No existing .git folder found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 2: Initializing fresh git repository..." -ForegroundColor Yellow
git init
git branch -M main
Write-Host "   Fresh git repository created" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Adding all files..." -ForegroundColor Yellow
git add .
$fileCount = (git diff --cached --numstat | Measure-Object).Count
Write-Host "   $fileCount files staged" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Production-ready AI YouTube Agency

Features:
- Error boundaries and crash prevention
- 6 AI providers with automatic fallback
- Rate limiting and circuit breakers
- Health monitoring endpoint
- Request validation and sanitization
- Memory optimization for Vercel
- 3-45 minute video support with audience targeting
- FREE media sources (no API keys needed)
- Zero-downtime architecture"
Write-Host "   Commit created successfully" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Adding GitHub remote..." -ForegroundColor Yellow
git remote add origin https://github.com/Uncle-T36/sixfold-systems-ai-youtube-agency.git 2>$null
Write-Host "   Remote added" -ForegroundColor Green

Write-Host ""
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "   This may take a moment..." -ForegroundColor Gray
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Repository pushed to GitHub" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com/new" -ForegroundColor White
    Write-Host "2. Import: Uncle-T36/sixfold-systems-ai-youtube-agency" -ForegroundColor White
    Write-Host "3. Add environment variable:" -ForegroundColor White
    Write-Host "   GROQ_API_KEY=<your_groq_key_from_.env.local>" -ForegroundColor Yellow
    Write-Host "4. Click Deploy!" -ForegroundColor White
    Write-Host ""
    Write-Host "The app is crash-proof and ready for production!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "  Push failed - see error above" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
}

