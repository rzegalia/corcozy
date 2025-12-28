# Corcozy 2025 - Deploy to MADSERVER
# Usage: .\scripts\deploy.ps1

$server = "madserver@192.168.1.157"
$appDir = "C:\Apps\corcozy-2025"

Write-Host "Deploying Corcozy to MADSERVER..." -ForegroundColor Cyan

# Step 1: Push local changes to GitHub
Write-Host "`n[1/4] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git push failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Pull on MADSERVER
Write-Host "`n[2/4] Pulling on MADSERVER..." -ForegroundColor Yellow
ssh $server "cd /d $appDir && git pull"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git pull failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Rebuild
Write-Host "`n[3/4] Rebuilding..." -ForegroundColor Yellow
ssh $server "cd /d $appDir && npm install && npm run build"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Restart the service
Write-Host "`n[4/4] Restarting service..." -ForegroundColor Yellow
# Kill existing node process and restart via task scheduler
ssh $server "taskkill /f /im node.exe 2>nul"
ssh $server "schtasks /run /tn `"Corcozy NYE`""

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "App should be live at https://nye.madfatter.lol" -ForegroundColor Cyan
