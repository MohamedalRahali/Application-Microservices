@echo off
echo ========================================
echo    Starting Keycloak with Docker
echo ========================================
echo.
echo Starting MySQL and Keycloak containers...
docker-compose up -d mysql keycloak

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo Checking container status...
docker-compose ps

echo.
echo ========================================
echo Keycloak should be available at:
echo   Admin Console: http://localhost:8180/admin
echo   Username: admin
echo   Password: admin
echo.
echo Don't forget to import keycloak-realm.json!
echo ========================================
echo.
echo Press any key to view Keycloak logs...
pause > nul
docker-compose logs -f keycloak