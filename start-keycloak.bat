@echo off
REM ============================================
REM Keycloak Windows Startup Script
REM ============================================
REM This script starts Keycloak on port 9090
REM Used by FoodExpress project
REM ============================================

echo.
echo ========================================
echo    FoodExpress Keycloak Launcher
echo ========================================
echo.
echo Starting Keycloak on port 9090...
echo.
echo After startup, access:
echo   Admin Console: http://localhost:9090/admin
echo   Username: admin
echo   Password: admin
echo.
echo Press Ctrl+C to stop Keycloak
echo.

REM Change to Keycloak installation bin directory
cd /d "%~dp0"

REM Run Keycloak in development mode
kc.bat start-dev

pause
