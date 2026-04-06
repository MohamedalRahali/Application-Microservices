# Troubleshooting Guide 🔧

Quick solutions for common issues during Windows Keycloak setup.

---

## 🔴 Common Problems & Solutions

### Problem 1: "Address already in use :9090"

**Cause**: Another process is using port 9090

**Solution**:
```powershell
# Find what's using port 9090
netstat -ano | findstr :9090

# Kill the process (replace PID with the number)
taskkill /PID <PID> /F

# Then restart Keycloak
cd C:\keycloak\bin
.\kc.bat start-dev
```

---

### Problem 2: "Connection refused" when accessing Keycloak

**Cause**: Keycloak not running or still starting

**Solution**:
```powershell
# 1. Check if Keycloak is running
netstat -ano | findstr :9090

# 2. Start Keycloak (if not running)
cd C:\keycloak\bin
.\kc.bat start-dev

# 3. Wait 15-20 seconds for startup
# 4. Check http://localhost:9090 in browser
```

---

### Problem 3: "401 Unauthorized" on API calls

**Cause**: Missing or invalid JWT token

**Solution**:

**a) Get a valid token**:
```powershell
$url = "http://localhost:9090/realms/foodexpress/protocol/openid-connect/token"
$body = "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"

$response = Invoke-WebRequest -Uri $url -Method POST -Body $body `
  -Headers @{"Content-Type"="application/x-www-form-urlencoded"}

$token = ($response.Content | ConvertFrom-Json).access_token
```

**b) Use the token in requests**:
```bash
curl -H "Authorization: Bearer $token" http://localhost:8080/api/v1/users/me
```

**c) Verify token**:
- Token should start with "eyJ"
- Token should not be an error message

---

### Problem 4: "HTTP Error 500" when importing realm

**Cause**: Invalid realm file or Keycloak permissions issue

**Solution**:

1. **Verify realm file exists**:
   ```powershell
   Test-Path "C:\Users\marwe\Desktop\web destribuer\food-delivery\keycloak-realm.json"
   ```

2. **Restart Keycloak** (in case of stale session):
   ```powershell
   # Stop: Press Ctrl+C in Keycloak terminal
   # Wait 5 seconds
   # Start:
   cd C:\keycloak\bin
   .\kc.bat start-dev
   ```

3. **Try re-importing**:
   - Go to: http://localhost:9090/admin
   - Login: admin / admin
   - Click "Add Realm"
   - Upload `keycloak-realm.json`

---

### Problem 5: Service won't start - "SEVERE: Error"

**Cause**: Keycloak connection failed or database issue

**Solution**:

1. **Check Keycloak is running**:
   ```bash
   curl http://localhost:9090
   ```
   Should return successfully (not "Connection refused")

2. **Check MySQL is running**:
   ```bash
   netstat -ano | findstr :3307
   ```

3. **Check application.yml has correct port (9090)**:
   ```yaml
   spring:
     security:
       oauth2:
         resourceserver:
           jwt:
             issuer-uri: http://localhost:9090/realms/foodexpress
   ```

4. **Restart the service**:
   ```bash
   # Press Ctrl+C to stop
   # Wait 5 seconds
   mvn spring-boot:run
   ```

---

### Problem 6: "Cannot find settings" in Keycloak Admin

**Cause**: Realm not fully loaded or admin not logged in

**Solution**:
1. Log out from Keycloak Admin
2. Navigate to: http://localhost:9090/admin
3. Login again: admin / admin
4. Make sure you see "Realm Settings" in left menu
5. Make sure "foodexpress" is selected (not "master")

---

### Problem 7: Token expires immediately

**Cause**: System clock issue or token configuration

**Solution**:

1. **Verify system time is correct**:
   ```powershell
   Get-Date
   ```
   Should show current time

2. **Check token expiry** (use jwt.io to decode):
   - Copy token
   - Paste at https://jwt.io
   - Check "exp" field (should be in future)
   - Check "iat" field (issued time should be recent)

3. **If time is wrong**, fix Windows time:
   ```powershell
   # Run as Administrator
   w32tm /resync /force
   ```

---

### Problem 8: MySQL port 3307 not found

**Cause**: MySQL not running or using different port

**Solution**:

1. **Start MySQL** (if installed locally):
   ```powershell
   # If using XAMPP/WAMP, start from control panel
   # OR access MySQL via:
   mysql -u root -p
   ```

2. **Verify port**:
   ```bash
   netstat -ano | findstr :3307
   ```

3. **If different port**, update config files:
   - Find: `spring.datasource.url: jdbc:mysql://localhost:3307/`
   - Replace with your port

---

### Problem 9: "No route to host" for API calls

**Cause**: Services not listening on correct ports

**Solution**:

1. **Verify all services running**:
   ```bash
   netstat -ano | findstr :8080  # Gateway
   netstat -ano | findstr :8085  # User Service
   netstat -ano | findstr :8081  # Delivery Service
   netstat -ano | findstr :8761  # Eureka
   ```

2. **Check Eureka dashboard**:
   http://localhost:8761
   Should show all services registered

3. **Test gateway directly**:
   ```bash
   curl http://localhost:8080
   ```

---

### Problem 10: Realm import shows "Invalid JSON"

**Cause**: File encoding or format issue

**Solution**:

1. **Verify file is valid JSON**:
   ```powershell
   $json = Get-Content "C:\Users\marwe\Desktop\web destribuer\food-delivery\keycloak-realm.json"
   $json | ConvertFrom-Json
   ```
   Should not show errors

2. **Copy file contents** and use direct JSON import:
   - Go to Keycloak Admin: http://localhost:9090/admin
   - Select "Master" realm (top left)
   - Click "New" → "Create Realm"
   - Paste JSON directly

3. **Or use Keycloak CLI**:
   ```powershell
   cd C:\keycloak\bin
   .\kc.bat import-realm --file=<full-path-to-realm-file>
   ```

---

## 🔵 Service-Specific Issues

### API Gateway (port 8080) won't start

**Check**:
- [ ] Eureka running on 8761
- [ ] Keycloak running on 9090
- [ ] Port 8080 is free

**Test**:
```bash
mvn spring-boot:run
# Should see "Tomcat started on port 8080"
```

---

### User Service (port 8085) won't start

**Check**:
- [ ] MySQL running on 3307
- [ ] Database `user_db` exists (should auto-create)
- [ ] Keycloak running on 9090

**Test**:
```bash
cd user-service
mvn spring-boot:run
# Should see "user_db" created
# Should see "Tomcat started on port 8085"
```

---

### Delivery Service (port 8081) won't start

**Check**:
- [ ] MySQL running on 3307
- [ ] Database `delivery_db` will auto-create
- [ ] Keycloak running on 9090

**Test**:
```bash
cd delivery-service
mvn spring-boot:run
# Should see "delivery_db" created
# Should see "Tomcat started on port 8081"
```

---

## 🟢 Verification Tests

### Test 1: Keycloak connectivity
```bash
curl http://localhost:9090/.well-known/openid-configuration
# Should return JSON with OpenID Connect endpoints
```

### Test 2: Token retrieval
```powershell
$url = "http://localhost:9090/realms/foodexpress/protocol/openid-connect/token"
$body = "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"

Invoke-WebRequest -Uri $url -Method POST -Body $body `
  -Headers @{"Content-Type"="application/x-www-form-urlencoded"}
# Should return access_token
```

### Test 3: API Gateway
```bash
curl -i http://localhost:8080
# Should return 302 or 200 (not 500)
```

### Test 4: Authenticated request
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/v1/users/me
# Should return user info (not 401)
```

### Test 5: Service discovery
```bash
curl http://localhost:8761
# Should show all services registered
```

---

## 📋 Debugging Checklist

If something doesn't work:

1. **✅ Keycloak running?**
   ```bash
   curl http://localhost:9090
   ```

2. **✅ MySQL running?**
   ```bash
   netstat -ano | findstr :3307
   ```

3. **✅ All configs using port 9090?**
   - [ ] user-service/application.yml
   - [ ] delivery-service/application.yml
   - [ ] api-gateway/application.yml

4. **✅ Token valid?**
   - Decode at jwt.io
   - Check "exp" not in past
   - Check "realm_access.roles" has values

5. **✅ Services registered in Eureka?**
   http://localhost:8761

6. **✅ Correct URL being called?**
   - Gateway: `http://localhost:8080`
   - User Service: `http://localhost:8085`
   - Delivery: `http://localhost:8081`

7. **✅ Firewall blocking ports?**
   Windows Defender might block ports
   Check: Settings → Privacy → Windows Defender Firewall → Allow an app

---

## 🆘 Still Having Issues?

1. **Check logs**:
   ```bash
   # In service terminal, look for ERROR lines
   ```

2. **Restart everything**:
   ```bash
   # Close all terminals
   # Kill all Java processes:
   taskkill /IM java.exe /F
   
   # Restart Keycloak, then services
   ```

3. **Review setup guides**:
   - [KEYCLOAK_WINDOWS.md](./KEYCLOAK_WINDOWS.md) — Full Windows setup
   - [SETUP_VERIFICATION.md](./SETUP_VERIFICATION.md) — Verification checklist
   - [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) — Command reference

4. **Check workspace structure**:
   ```bash
   # All folders should exist:
   dir eureka-server
   dir api-gateway
   dir user-service
   dir delivery-service
   ```

---

## 💡 Pro Tips

- **Logs are your friend**: Look at terminal output for actual error messages
- **Port conflicts**: Use `netstat -ano` to find what's using each port
- **Token debugging**: Paste JWT at https://jwt.io to decode and verify
- **Database debugging**: Connect to MySQL to inspect ✅
- **Keycloak debugging**: Check admin console → Realm Settings → Events

---

**Last Updated**: 2026-03-30
**Status**: ✅ Ready to help
