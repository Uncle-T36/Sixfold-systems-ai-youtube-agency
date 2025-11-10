@echo off
cd /d "c:\Users\tchaf\OneDrive\Desktop\SixFold Systems\ai_youtube_agency"
git add CRASH_PROOF.md PRODUCTION_READY.md fresh-git-setup.ps1
git commit -m "Remove API keys from documentation"
git push -u origin main --force
pause
