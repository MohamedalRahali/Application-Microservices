@echo off
echo ========================================
echo    Starting Keycloak on Port 9090
echo ========================================
echo.
echo Stopping any existing Keycloak containers...
docker stop foodexpress-keycloak-9090 2>nul
docker rm foodexpress-keycloak-9090 2>nul

echo.
echo Starting MySQL (if not running)...
docker-compose up -d mysql

echo.
echo Starting Keycloak on port 9090...
docker run -d ^
  --name foodexpress-keycloak-9090 ^
  --network food-delivery_foodexpress-network ^
  -p 9090:8080 ^
  -e KEYCLOAK_ADMIN=admin ^
  -e KEYCLOAK_ADMIN_PASSWORD=admin ^
  -e KC_DB=mysql ^
  -e KC_DB_URL=jdbc:mysql://foodexpress-mysql:3306/keycloak_db ^
  -e KC_DB_USERNAME=root ^
  -e KC_DB_PASSWORD=MySecurePassword@123 ^
  -e KC_HOSTNAME=localhost ^
  -e KC_HOSTNAME_PORT=9090 ^
  -e KC_HOSTNAME_STRICT=false ^
  -e KC_HOSTNAME_STRICT_HTTPS=false ^
  -v "%cd%\keycloak-realm.json:/opt/keycloak/data/import/realm.json:ro" ^
  quay.io/keycloak/keycloak:latest start-dev --import-realm

echo.
echo Waiting for Keycloak to start...
timeout /t 15 /nobreak > nul

echo.
echo ========================================
echo Keycloak is starting up...
echo   Admin Console: http://localhost:9090/admin
echo   Username: admin
echo   Password: admin
echo.
echo The realm should be automatically imported!
echo ========================================
echo.
echo Press any key to view Keycloak logs...
pause > nul
docker logs -f foodexpress-keycloak-9090