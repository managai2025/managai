Write-Host "🚀 ManagAI Go Server - Deploy to GitHub" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check git status
Write-Host "`n📊 Git status:" -ForegroundColor Yellow
git status

# Add all files
Write-Host "`n📁 Adding files..." -ForegroundColor Yellow
git add .

# Commit
$commitMessage = Read-Host "`n💬 Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Add Go server for AWS App Runner deployment"
}

Write-Host "`n💾 Committing with message: $commitMessage" -ForegroundColor Yellow
git commit -m $commitMessage

# Push
Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "`n🌐 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create AWS App Runner service" -ForegroundColor White
Write-Host "2. Connect to your GitHub repository" -ForegroundColor White
Write-Host "3. Set environment variables (CRON_SECRET, MANAGAI_ORG_ID)" -ForegroundColor White
Write-Host "4. Deploy!" -ForegroundColor White

Read-Host "`nPress Enter to continue"
