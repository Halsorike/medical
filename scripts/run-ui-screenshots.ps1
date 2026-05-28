# run-ui-screenshots.ps1
# Run from: D:\Projects\Medical

Set-Location "D:\Projects\Medical"

Write-Host "Starting dev server..." -ForegroundColor Cyan
$server = Start-Process -FilePath "npx" -ArgumentList "next dev" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 8

Write-Host "Running UI automation + screenshots..." -ForegroundColor Cyan
npx playwright test e2e/ui-screenshot.spec.ts --reporter=line

Write-Host "Opening visual report..." -ForegroundColor Green
Start-Process "screenshots\ui-automation\index.html"

Write-Host "Stopping dev server..." -ForegroundColor Yellow
Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue

Write-Host "Done!" -ForegroundColor Green
