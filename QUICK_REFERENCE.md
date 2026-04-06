# FoodExpress Windows Keycloak - Quick Reference 📚

## 🚀 Start Services (One-Command Quick Start)

### Terminal 1: Start Keycloak
```powershell
cd C:\keycloak\bin
.\kc.bat start-dev
```

### Terminal 2: Start Eureka
```bash
cd eureka-server
mvn spring-boot:run
```

### Terminal 3: Start API Gateway
```bash
cd api-gateway
mvn spring-boot:run
```

### Terminal 4: Start User Service
```bash
cd user-service
mvn spring-boot:run
```

### Terminal 5: Start Delivery Service
```bash
cd delivery-service
mvn spring-boot:run
```

---

## 🔑 Get JWT Token (Copy-Paste Ready)

### PowerShell (Windows)
```powershell
# Get token for customer user
$response = Invoke-WebRequest -Uri "http://localhost:9090/realms/foodexpress/protocol/openid-connect/token" `
  -Method POST `
  -Headers @{"Content-Type"="application/x-www-form-urlencoded"} `
  -Body "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"

$token = ($response.Content | ConvertFrom-Json).access_token

Write-Host "Token: $token"
```

### cURL (Git Bash / WSL)
```bash
curl -X POST http://localhost:9090/realms/foodexpress/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"
```

---

## 🧪 API Test Commands

### Get Current User
```bash
curl -H "Authorization: Bearer $token" \
  http://localhost:8080/api/v1/users/me
```

### List All Deliveries
```bash
curl -H "Authorization: Bearer $token" \
  http://localhost:8080/api/deliveries
```

### Create Delivery Order
```bash
curl -X POST http://localhost:8080/api/deliveries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{
    "orderId": "ORD-001",
    "customerId": "123",
    "restaurantId": "1",
    "deliveryAddress": "123 Main St",
    "estimatedDeliveryTime": 30,
    "totalPrice": 45.50
  }'
```

### Get Promotion by Code
```bash
curl -X POST http://localhost:8080/api/promotions/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{
    "code": "WELCOME20"
  }'
```

---

## 🔐 User Credentials

### Admin User
- **Username**: admin
- **Password**: Admin@123
- **Roles**: admin, customer

### Restaurant Owner
- **Username**: restaurant_owner
- **Password**: Owner@123
- **Roles**: restaurant_owner, customer

### Delivery Person
- **Username**: delivery_person
- **Password**: Delivery@123
- **Roles**: delivery_person, customer

### Customer (Default)
- **Username**: customer
- **Password**: Customer@123
- **Roles**: customer

---

## 🌐 Service URLs

| Service | Port | URL |
|---------|------|-----|
| Keycloak Admin | 9090 | http://localhost:9090/admin |
| API Gateway | 8080 | http://localhost:8080 |
| Eureka Discovery | 8761 | http://localhost:8761 |
| User Service | 8085 | http://localhost:8085 |
| Delivery Service | 8081 | http://localhost:8081 |
| Promotion Service | 8082 | http://localhost:8082 |
| Restaurant Service | 8083 | http://localhost:8083 |
| Menu Service | 8084 | http://localhost:8084 |

---

## 🐛 Health Checks

### Check if Keycloak is Running
```bash
curl http://localhost:9090/health
# Response: {"status":"UP"}
```

### Check if Eureka is Running
```bash
curl http://localhost:8761/eureka/apps
# Response: XML list of registered applications
```

### Check if User Service is Running
```bash
curl http://localhost:8085/actuator/health
# Response: {"status":"UP"}
```

---

## 🛠️ Common Issues

### Fix: "Port 9090 already in use"
```bash
# Find process using port 9090
netstat -ano | findstr :9090

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Fix: "Java not found"
- Download Java 17: https://adoptium.net/
- Add to Windows PATH environment variable
- Restart PowerShell

### Fix: "Cannot connect to Keycloak"
```bash
# Check if firewall is blocking
# Go to: Windows Defender Firewall → Allow an app
# Add port 9090 to exceptions
```

---

## 📊 Database

### MySQL Connection
- **Host**: localhost:3307
- **Username**: root
- **Password**: MySecurePassword@123
- **Databases**: user_db, delivery_db, promotion_db, restaurant_db, menu_db

### Connect via MySQL CLI
```bash
mysql -u root -p -h 127.0.0.1 -P 3307
# Password: MySecurePassword@123
```

---

## 🔄 Maven Commands

### Build All Services
```bash
mvn clean install
```

### Build Specific Service
```bash
cd user-service
mvn clean package
```

### Run Tests
```bash
mvn test
```

### Skip Tests During Build
```bash
mvn clean install -DskipTests
```

---

## 🐳 Docker Commands (Alternative)

### Start All with Docker
```bash
docker-compose -f docker-compose.local-keycloak.yml up -d
```

### View Docker Logs
```bash
docker-compose logs -f
```

### Stop All Services
```bash
docker-compose down
```

### Remove All Containers and Data
```bash
docker-compose down -v
```

---

## 📝 Configuration Files

| File | Purpose |
|------|---------|
| `keycloak-realm.json` | Keycloak realm definition |
| `docker-compose.yml` | Full Docker stack (with Keycloak) |
| `docker-compose.local-keycloak.yml` | Docker stack (local Keycloak) |
| `KEYCLOAK_WINDOWS.md` | Complete Windows setup guide |
| `KEYCLOAK_SETUP.md` | Docker setup guide |
| `README.md` | Project overview |

---

## 🎯 Typical Development Workflow

1. **Start Keycloak** in Terminal 1
2. **Start Eureka** in Terminal 2
3. **Start Gateway** in Terminal 3
4. **Start Services** in Terminals 4+
5. **Get Token** using PowerShell command
6. **Test API** using cURL or Postman
7. **View Logs** in respective terminals
8. **Stop All** with Ctrl+C in each terminal

---

## 💡 Pro Tips

- Use **PowerShell ISE** for better script editing
- Use **Postman** for API testing (import token in Postman)
- Use **Tables** in MySQL Workbench to view data
- Check **Keycloak logs** for JWT validation issues
- Check **Service logs** for database connection issues

---

## 🔗 Important Links

- [Complete Windows Guide](./KEYCLOAK_WINDOWS.md)
- [Docker Setup](./KEYCLOAK_SETUP.md)
- [Project README](./README.md)
- [Dependency Fixes](./DEPENDENCY_FIXES.md)
- [Keycloak Official Docs](https://www.keycloak.org/)

---

**Last Updated**: 2026-03-30  
**Status**: ✅ Ready for development
