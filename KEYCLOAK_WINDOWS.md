# Keycloak Windows Setup Guide ⚙️

## Prerequisites

- Windows OS (7, 10, 11)
- Java 11 or newer installed
- Keycloak 25.0.0+ (already installed at C:\keycloak)
- FoodExpress realm configuration file

---

## 📍 Getting Started

### 1. Verify Java Installation

Open PowerShell or Command Prompt and check Java version:

```bash
java -version
```

Should output something like:
```
openjdk version "17.0.x"
```

If Java is not found, download and install from: https://adoptium.net/

---

## 🚀 Starting Keycloak on Windows

### Option A: Using PowerShell (Recommended)

```powershell
# Navigate to your Keycloak installation
cd C:\keycloak\bin

# Run Keycloak in development mode
.\kc.bat start-dev
```

**Expected Output:**
```
2026-03-30 14:25:00,000 INFO [io.quarkus.runtime.Application] Keycloak 25.0.0 on JVM started in 15.5s
2026-03-30 14:25:00,123 INFO [io.quarkus.runtime.Application] Listen on http://localhost:9090
```

✅ Keycloak is now running on **http://localhost:9090**

### Option B: Using Batch File (cmd.exe)

```batch
cd C:\keycloak\bin
kc.bat start-dev
```

### Option C: Create a Startup Script

Create `start-keycloak.bat` in your Keycloak folder:

```batch
@echo off
REM Keycloak Windows Startup Script
cd /d "%~dp0\bin"
echo.
echo ========================================
echo    Starting Keycloak on port 9090...
echo ========================================
echo.
kc.bat start-dev
pause
```

Double-click this file to start Keycloak anytime!

---

## 🛑 Stopping Keycloak

In the PowerShell/Command Prompt window where Keycloak is running:

```bash
Ctrl + C
```

Wait for graceful shutdown (10-15 seconds)

---

## 📋 Configuration for Production

If you want to run Keycloak on a different port, modify the startup:

```powershell
# Run on port 8080 instead
cd C:\keycloak\bin
.\kc.bat start-dev --http-port=8080
```

However, for this project, keep port **9090** (it's configured in all services).

---

## ✅ Verify Keycloak is Running

### Method 1: Direct URL
Open in your browser:
```
http://localhost:9090
```

You should see the Keycloak login page.

### Method 2: Health Check (PowerShell)
```powershell
curl http://localhost:9090/health
```

Should return:
```json
{"status":"UP"}
```

### Method 3: Admin Console
```
URL: http://localhost:9090/admin/
Username: admin
Password: admin
```

---

## 📥 Import FoodExpress Realm

### Step 1: Access Keycloak Admin Console

```
http://localhost:9090/admin/
```

- Username: `admin`
- Password: `admin`

### Step 2: Import Realm

1. Click **"Create Realm"** (or gear icon → **Add Realm**)
2. Click **"Browse"** and select `keycloak-realm.json` from:
   ```
   C:\Users\marwe\Desktop\web destribuer\food-delivery\keycloak-realm.json
   ```
3. Click **"Create"**

✅ The `foodexpress` realm is now imported with:
- 4 default users (admin, restaurant_owner, delivery_person, customer)
- 2 OAuth2 clients (foodexpress-client, foodexpress-server)
- All roles configured

### Step 3: Verify Users

Go to **Realm Settings** → **Users**, you should see:
- admin
- restaurant_owner
- delivery_person
- customer

---

## 🔐 Default Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | admin, customer |
| restaurant_owner | Owner@123 | restaurant_owner, customer |
| delivery_person | Delivery@123 | delivery_person, customer |
| customer | Customer@123 | customer |

---

## 🧪 Get Access Token (Test)

From PowerShell:

```powershell
$response = curl -X POST http://localhost:9090/realms/foodexpress/protocol/openid-connect/token `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"

$response | ConvertFrom-Json | Select-Object -ExpandProperty access_token
```

Or use simpler format:

```bash
curl -X POST http://localhost:9090/realms/foodexpress/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"
```

Copy the `access_token` value for API testing.

---

## 🐛 Troubleshooting

### Issue: Port 9090 Already in Use

```bash
# Find what's using port 9090
netstat -ano | findstr :9090

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

Then restart Keycloak.

### Issue: Java Not Found

Install Java from https://adoptium.net/ and add to PATH:

1. Copy Java installation path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.x`)
2. Add to Windows PATH:
   - Open **Environment Variables**
   - Add the Java `bin` folder to PATH
   - Restart PowerShell

### Issue: "Access Denied" Error

Run PowerShell as **Administrator** before starting Keycloak.

### Issue: Realm Not Importing

Make sure `keycloak-realm.json` file path is correct:

```
C:\Users\marwe\Desktop\web destribuer\food-delivery\keycloak-realm.json
```

Check the file exists and is properly formatted JSON.

### Issue: Services Can't Connect to Keycloak

1. Ensure Keycloak is running: `curl http://localhost:9090`
2. Check firewall isn't blocking port 9090
3. Verify token issuer URI in service `application.yml` files:
   ```yaml
   issuer-uri: http://localhost:9090/realms/foodexpress
   ```

---

## 📝 Running Services with Local Keycloak

All services are already configured to use **http://localhost:9090** for Keycloak.

**Startup Order:**

1. **Eureka Server** (8761)
   ```bash
   cd eureka-server
   mvn spring-boot:run
   ```

2. **API Gateway** (8080)
   ```bash
   cd api-gateway
   mvn spring-boot:run
   ```

3. **User Service** (8085)
   ```bash
   cd user-service
   mvn spring-boot:run
   ```

4. **Delivery Service** (8081)
   ```bash
   cd delivery-service
   mvn spring-boot:run
   ```

5. **Other Services** (8082, 8083, 8084)
   ```bash
   cd promotion-service && mvn spring-boot:run
   cd restaurant-service && mvn spring-boot:run
   cd menu-service && mvn spring-boot:run
   ```

---

## ✨ Example: Get Token and Call API

### 1. Get Token
```bash
$token = (curl -X POST http://localhost:9090/realms/foodexpress/protocol/openid-connect/token `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password" | ConvertFrom-Json).access_token

echo "Token: $token"
```

### 2. Get Current User Profile
```bash
curl -X GET http://localhost:8080/api/v1/users/me `
  -H "Authorization: Bearer $token"
```

### 3. Place Order
```bash
curl -X POST http://localhost:8080/api/deliveries `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "orderId": "ORD-001",
    "customerId": "123",
    "restaurantId": "1",
    "deliveryAddress": "123 Main St",
    "estimatedDeliveryTime": 30,
    "totalPrice": 45.50
  }'
```

---

## 📊 Database Connection

Keycloak uses a local H2 database by default in development mode.

Database file location:
```
C:\keycloak\data\keycloak.db
```

This is automatically created when you run Keycloak for the first time.

---

## 🔐 Security Notes

- ⚠️ Development mode is NOT for production use
- Change admin password immediately in production
- Use HTTPS in production
- Never commit `keycloak-realm.json` with real passwords

---

## 📚 Useful Links

- Keycloak Official Docs: https://www.keycloak.org/
- Getting Started: https://www.keycloak.org/getting-started/
- Windows Server Setup: https://www.keycloak.org/server/configuration
- Realm Configuration: https://www.keycloak.org/docs/latest/server_admin/

---

## ❓ Additional Help

For issues specific to your setup, check:
1. Logs in the PowerShell window
2. Keycloak admin console for realm/user errors
3. Service logs (check `target/` folder for Spring Boot logs)

Happy authenticating! 🎉
