# Windows Keycloak Configuration - Summary ✅

## Overview

Your FoodExpress project has been updated to support **local Keycloak on Windows (port 9090)** while maintaining Docker support.

---

## 🔧 Files Updated

### 1. Service Configuration Files (Port Changed: 8180 → 9090)

| File | Changes |
|------|---------|
| `user-service/src/main/resources/application.yml` | issuer-uri: 8180 → 9090 |
| `delivery-service/src/main/resources/application.yml` | issuer-uri: 8180 → 9090 |
| `api-gateway/src/main/resources/application.yml` | issuer-uri: 8180 → 9090 |

**Impact**: All services now configured to connect to Windows Keycloak on port 9090

---

## 📚 New Documentation Files Created

### 1. **KEYCLOAK_WINDOWS.md** ⭐
Complete guide for using Keycloak on Windows, including:
- ✅ Prerequisites & Java setup
- ✅ 3 methods to start Keycloak
- ✅ Realm import instructions
- ✅ Token retrieval examples
- ✅ Troubleshooting guide
- ✅ Service startup sequence

**Use this file as your primary reference for Windows Keycloak**

### 2. **docker-compose.local-keycloak.yml**
Alternative Docker Compose file for:
- ✅ Running services in Docker
- ✅ Using local Windows Keycloak (not Docker)
- ✅ Proper host.docker.internal bridge configuration
- ✅ All database services in Docker

**Use when you want Docker services + Windows Keycloak**

---

## 📝 Updated Documentation

### 1. **README.md**
- ✅ Added quick start options (3 methods)
- ✅ Windows Local Keycloak as recommended option
- ✅ Token retrieval for both port 9090 and 8180
- ✅ Links to setup guides

### 2. **KEYCLOAK_SETUP.md**
- ✅ Added quick links at top
- ✅ Reference to Windows guide

---

## 🚀 Your Setup

### Keycloak Location
- **Path**: `C:\keycloak`
- **Port**: 9090
- **Status**: Not running (need to start manually)

### Quick Start Checklist

- [ ] **Step 1**: Open PowerShell as Administrator
- [ ] **Step 2**: Start Keycloak
  ```powershell
  cd C:\keycloak\bin
  .\kc.bat start-dev
  ```
  Wait for: `Listen on http://localhost:9090`

- [ ] **Step 3**: Import realm (see KEYCLOAK_WINDOWS.md)
  - Load: `C:\Users\marwe\Desktop\web destribuer\food-delivery\keycloak-realm.json`

- [ ] **Step 4**: Start services (4 separate terminals)
  ```bash
  cd eureka-server && mvn spring-boot:run
  cd api-gateway && mvn spring-boot:run
  cd user-service && mvn spring-boot:run
  cd delivery-service && mvn spring-boot:run
  ```

- [ ] **Step 5**: Verify
  - Keycloak: http://localhost:9090/admin (admin/admin)
  - Eureka: http://localhost:8761
  - API Gateway: http://localhost:8080

---

## 🎯 Configuration Details

### Service Keycloak Configuration

All services now use:
```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:9090/realms/foodexpress
          jwk-set-uri: http://localhost:9090/realms/foodexpress/protocol/openid-connect/certs
```

### Docker Services (if using Docker + Windows Keycloak)

Use: `docker-compose -f docker-compose.local-keycloak.yml up -d`

Services connect via: `http://host.docker.internal:9090`

---

## 🔐 Default Users

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | admin, customer |
| restaurant_owner | Owner@123 | restaurant_owner, customer |
| delivery_person | Delivery@123 | delivery_person, customer |
| customer | Customer@123 | customer |

---

## 🧪 Test Access Token

```powershell
# Windows Keycloak (port 9090)
curl -X POST http://localhost:9090/realms/foodexpress/protocol/openid-connect/token `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"
```

Extract token and use:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/v1/users/me
```

---

## 📋 Deployment Options

### Option 1: Local Windows Keycloak + Manual Services ⭐
- ✅ Simplest for development
- ✅ Better performance
- ✅ Easier debugging
- Services run on standalone Java processes
- Keycloak runs natively on Windows

### Option 2: Docker Full Stack
- ✅ Everything containerized
- ✅ Single command start
- Use original: `docker-compose.yml`
- Keycloak runs in Docker on port 8180

### Option 3: Docker Services + Windows Keycloak
- ✅ Hybrid approach
- ✅ Services isolated in Docker
- ✅ Keycloak on Windows
- Use: `docker-compose.local-keycloak.yml`

---

## ⚠️ Important Notes

1. **Port 9090**: All services configured for this port
2. **Firewall**: Ensure Windows firewall allows port 9090
3. **Java Path**: Make sure Java is in your PATH (for `kc.bat` command)
4. **Database**: MySQL still uses port 3307 locally
5. **Realm File**: Located at `food-delivery/keycloak-realm.json`

---

## 🐛 Quick Troubleshooting

### Keycloak won't start
- [ ] Check Java is installed: `java -version`
- [ ] Run PowerShell as Administrator
- [ ] Check port 9090 is free: `netstat -ano | findstr :9090`

### Services can't reach Keycloak
- [ ] Verify Keycloak is running: `curl http://localhost:9090`
- [ ] Check firewall isn't blocking port 9090
- [ ] Verify config files have port 9090

### Token not working
- [ ] Check token isn't expired
- [ ] Verify realm is imported correctly
- [ ] Check user exists in Keycloak admin console

**More troubleshooting**: See [KEYCLOAK_WINDOWS.md](./KEYCLOAK_WINDOWS.md#-troubleshooting)

---

## 📞 Support

1. **Windows Keycloak Setup** → [KEYCLOAK_WINDOWS.md](./KEYCLOAK_WINDOWS.md) ⭐
2. **General Authentication** → [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md)
3. **Project Overview** → [README.md](./README.md)
4. **Dependency Info** → [DEPENDENCY_FIXES.md](./DEPENDENCY_FIXES.md)

---

## ✨ Next Steps

1. Start Keycloak using the Windows guide
2. Import the realm from `keycloak-realm.json`
3. Start services in order (Eureka → Gateway → User → Delivery → Others)
4. Test token retrieval
5. Test order process with authenticated requests

**Happy coding! 🎉**
