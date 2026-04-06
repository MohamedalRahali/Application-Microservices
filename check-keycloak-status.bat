@echo off
echo ========================================
echo    Keycloak Status Checker
echo ========================================
echo.

echo Checking if Keycloak is running on port 9090...
curl -s http://localhost:9090 > nul
if %errorlevel% == 0 (
    echo ✓ Keycloak is responding on port 9090
) else (
    echo ✗ Keycloak is NOT responding on port 9090
    echo.
    echo Possible solutions:
    echo 1. Start Keycloak: kc.bat start-dev
    echo 2. Check if running on different port
    echo 3. Use Docker: start-keycloak-9090.bat
)

echo.
echo Checking if foodexpress realm exists...
curl -s "http://localhost:9090/realms/foodexpress" > nul
if %errorlevel% == 0 (
    echo ✓ foodexpress realm is accessible
) else (
    echo ✗ foodexpress realm is NOT accessible
    echo.
    echo Solution: Import keycloak-realm.json in admin console
)

echo.
echo ========================================
echo Access URLs:
echo   Keycloak Home: http://localhost:9090
echo   Admin Console: http://localhost:9090/admin
echo   Realm URL: http://localhost:9090/realms/foodexpress
echo ========================================
pause