# FoodExpress Windows Setup - Verification Checklist ✅

Use this checklist to verify your Windows Keycloak setup is correct.

---

## 📋 Pre-Setup Verification

- [ ] **Java Installed**
  ```bash
  java -version
  ```
  ✅ Should show Java 11 or newer

- [ ] **Keycloak Installed**
  - [ ] Directory exists: `C:\keycloak`
  - [ ] Bin folder exists: `C:\keycloak\bin`
  - [ ] File exists: `C:\keycloak\bin\kc.bat`

- [ ] **MySQL Running on Port 3307**
  ```bash
  netstat -ano | findstr :3307
  ```
  ✅ Should show MySQL process

- [ ] **Maven Installed**
  ```bash
  mvn -version
  ```
  ✅ Should show Maven 3.8+

---

## 🚀 Keycloak Setup Verification

### Start Keycloak
```powershell
cd C:\keycloak\bin
.\kc.bat start-dev
```

Wait for this message:
```
... Keycloak 25.0.0 on JVM started in X.XXs
... Listen on http://localhost:9090
```

- [ ] **Keycloak Started Successfully**
- [ ] **Port 9090 is Accessible**: http://localhost:9090
- [ ] **Admin Console Works**: http://localhost:9090/admin

---

## 🔐 Realm Import Verification

1. Go to: http://localhost:9090/admin/
2. Login: admin / admin

- [ ] **Logged into Keycloak Admin Console**

3. Click **"Create Realm"** or **Add Realm**
4. Select file: `C:\Users\marwe\Desktop\web destribuer\food-delivery\keycloak-realm.json`
5. Click **"Create"**

- [ ] **Realm "foodexpress" Created**

### Verify Users
- [ ] **User "admin" exists** (Realm Settings → Users)
- [ ] **User "customer" exists**
- [ ] **User "restaurant_owner" exists**
- [ ] **User "delivery_person" exists**

---

## 🔧 Service Configuration Verification

### Check User Service Config
File: `user-service/src/main/resources/application.yml`

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:9090/realms/foodexpress
          jwk-set-uri: http://localhost:9090/realms/foodexpress/protocol/openid-connect/certs
```

- [ ] **Port is 9090** (not 8180)
- [ ] **Realm is "foodexpress"**

### Check Delivery Service Config
File: `delivery-service/src/main/resources/application.yml`

- [ ] **Port is 9090**
- [ ] **Realm is "foodexpress"**

### Check API Gateway Config
File: `api-gateway/src/main/resources/application.yml`

- [ ] **Port is 9090**
- [ ] **Realm is "foodexpress"**

---

## 🧪 Token Retrieval Test

### PowerShell Command
```powershell
$url = "http://localhost:9090/realms/foodexpress/protocol/openid-connect/token"
$body = "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"

$response = Invoke-WebRequest -Uri $url -Method POST -Body $body `
  -Headers @{"Content-Type"="application/x-www-form-urlencoded"}

$token = ($response.Content | ConvertFrom-Json).access_token
Write-Host $token
```

- [ ] **Token retrieval successful**
- [ ] **Token output is long string (not error)**
- [ ] **Token starts with "eyJ"**

---

## 🚀 Service Startup Verification

### Terminal 1: Eureka Server
```bash
cd eureka-server
mvn spring-boot:run
```

Wait for:
```
Tomcat started on port 8761
```

- [ ] **Eureka started on port 8761**
- [ ] **URL works**: http://localhost:8761

### Terminal 2: API Gateway
```bash
cd api-gateway
mvn spring-boot:run
```

Wait for:
```
Tomcat started on port 8080
```

- [ ] **Gateway started on port 8080**
- [ ] **URL works**: http://localhost:8080

### Terminal 3: User Service
```bash
cd user-service
mvn spring-boot:run
```

Wait for:
```
Tomcat started on port 8085
```

- [ ] **User Service started on port 8085**
- [ ] **URL works**: http://localhost:8085

### Terminal 4: Delivery Service
```bash
cd delivery-service
mvn spring-boot:run
```

Wait for:
```
Tomcat started on port 8081
```

- [ ] **Delivery Service started on port 8081**
- [ ] **URL works**: http://localhost:8081

---

## 🔍 Eureka Registration Verification

Go to: http://localhost:8761

You should see under **Instances currently registered with Eureka**:
- [ ] **USER-SERVICE** (8085)
- [ ] **API-GATEWAY** (8080)
- [ ] **DELIVERY-SERVICE** (8081)
- [ ] (Other services if running)

---

## 🧪 API Endpoint Tests

### Test 1: Get Current User
```bash
curl -H "Authorization: Bearer <your_token>" \
  http://localhost:8080/api/v1/users/me
```

- [ ] **Returns user information** (not 401 Unauthorized)
- [ ] **Response includes email and username**

### Test 2: Create Delivery
```bash
curl -X POST http://localhost:8080/api/deliveries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "orderId": "TEST-001",
    "customerId": "123",
    "restaurantId": "1",
    "deliveryAddress": "Test Address",
    "estimatedDeliveryTime": 30,
    "totalPrice": 50.00
  }'
```

- [ ] **Returns 200 OK** (not 401/403)
- [ ] **Response includes order ID**

### Test 3: Get Deliveries
```bash
curl -H "Authorization: Bearer <your_token>" \
  http://localhost:8080/api/deliveries/order/TEST-001
```

- [ ] **Returns delivery information**
- [ ] **Order status shows** (PENDING, CONFIRMED, etc.)

---

## 🐛 Troubleshooting Checklist

If something fails, verify:

### Keycloak Issues
- [ ] Port 9090 is free: `netstat -ano | findstr :9090`
- [ ] Keycloak running with message "Listen on http://localhost:9090"
- [ ] Firewall not blocking port 9090
- [ ] Realm file exists: `keycloak-realm.json`
- [ ] Realm imported (visible in admin console)

### Database Issues
- [ ] MySQL running on port 3307
- [ ] Databases auto-created: user_db, delivery_db, etc.
- [ ] Can connect: `mysql -u root -p -h 127.0.0.1 -P 3307`

### Service Issues
- [ ] All config files point to port 9090
- [ ] Services can reach Keycloak: `curl http://localhost:9090`
- [ ] Eureka can find services
- [ ] Gateway can route to services
- [ ] No port conflicts (3307, 8080, 8085, 8081, 8761, 9090)

### Token Issues
- [ ] Keycloak realm exists
- [ ] User exists in realm
- [ ] Token contains "eyJ" prefix
- [ ] Token not expired
- [ ] Token passed in "Authorization: Bearer" header

---

## ✅ Final Verification

All the following should work:

| Item | Command | Expected |
|------|---------|----------|
| Java | `java -version` | Java 11+ |
| Maven | `mvn -version` | Maven 3.8+ |
| MySQL | `netstat -ano \| findstr :3307` | Process found |
| Keycloak | `curl http://localhost:9090` | 200 OK |
| Eureka | `curl http://localhost:8761` | 200 OK |
| Gateway | `curl http://localhost:8080` | 200 OK |
| User Service | `curl http://localhost:8085/actuator/health` | {"status":"UP"} |

---

## 🎉 Success Criteria

Your setup is **COMPLETE** when:

✅ Keycloak running on http://localhost:9090
✅ Realm "foodexpress" imported
✅ All 4 users exist in realm
✅ All services registered in Eureka
✅ Token retrieval works
✅ Can call authenticated API endpoints
✅ Orders can be placed and tracked

---

## 📞 Getting Help

1. **Setup Issues** → See [KEYCLOAK_WINDOWS.md](./KEYCLOAK_WINDOWS.md)
2. **Configuration Issues** → See [WINDOWS_KEYCLOAK_CONFIG.md](./WINDOWS_KEYCLOAK_CONFIG.md)
3. **Quick Commands** → See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
4. **General Info** → See [README.md](./README.md)

---

**Last Updated**: 2026-03-30
**Status**: ✅ Ready to verify your setup
