# ============================================
# Keycloak Windows Startup Script (PowerShell)
# ============================================
# This script starts Keycloak on port 9090
# Used by FoodExpress project
# ============================================

Write-Host ""
Write-Host "========================================"
Write-Host "   FoodExpress Keycloak Launcher"
Write-Host "========================================"
Write-Host ""
Write-Host "Starting Keycloak on port 9090..."
Write-Host ""
Write-Host "After startup, access:"
Write-Host "  Admin Console: http://localhost:9090/admin"
Write-Host "  Username: admin"
Write-Host "  Password: admin"
Write-Host ""
Write-Host "Press Ctrl+C to stop Keycloak"
Write-Host ""

# Check if running from script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Verify Keycloak exists
if (Test-Path ".\kc.bat") {
    Write-Host "✓ Found Keycloak in current directory" -ForegroundColor Green
    Write-Host ""
    
    # Run Keycloak in development mode
    & ".\kc.bat" start-dev
} else {
    Write-Host "✗ Error: kc.bat not found!" -ForegroundColor Red
    Write-Host "Make sure this script is in your Keycloak bin directory" -ForegroundColor Yellow
    Write-Host "Example: C:\keycloak\bin\start-keycloak.ps1"
    Read-Host "Press Enter to exit"
    exit 1
}
