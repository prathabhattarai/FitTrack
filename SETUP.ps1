Write-Host "MONOREPO FINAL SETUP" -ForegroundColor Cyan
Write-Host "All npm servers must be stopped first!" -ForegroundColor Yellow

Write-Host "`nDeleting markdown files..." -ForegroundColor Yellow
$mdFiles = @("ADMIN_BOOKING_COMPLETE.md", "ADMIN_BOOKING_FIX_SUMMARY.md", "FOLDER_CLEANUP.md", "PROJECT_STRUCTURE.md", "QUICK_START_TEST.md")
foreach ($f in $mdFiles) {
    if (Test-Path $f) {
        Remove-Item $f -Force 2>$null
        Write-Host "Deleted: $f"
    }
}

Write-Host "`nDeleting react_client_sample..." -ForegroundColor Yellow
if (Test-Path "react_client_sample") {
    Remove-Item "react_client_sample" -Recurse -Force 2>$null
    Write-Host "Deleted: react_client_sample"
}

Write-Host "`nRenaming my-app to frontend..." -ForegroundColor Yellow
if (Test-Path "my-app") {
    Rename-Item "my-app" "frontend" 2>$null
    if ($?) { Write-Host "Renamed: my-app to frontend" }
    else { Write-Host "Please run: ren my-app frontend" }
}

Write-Host "`nFinal structure:" -ForegroundColor Green
Get-ChildItem -Directory | Select-Object -ExpandProperty Name

Write-Host "`nSetup complete!" -ForegroundColor Green
