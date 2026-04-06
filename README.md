# FoodExpress — Architecture Microservices

## 🔐 Authentication

This project now includes **Keycloak OAuth2/OIDC** authentication. All API requests require a valid JWT token.

### Keycloak Setup Options:

1. **Windows Local Keycloak** → [KEYCLOAK_WINDOWS.md](./KEYCLOAK_WINDOWS.md) ⭐ RECOMMENDED
2. **Docker Keycloak** → [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md)

## Structure

```
food-delivery/
├── eureka-server/        # Service Discovery (port 8761)
├── api-gateway/          # API Gateway with OAuth2 (port 8080)
├── user-service/         # User management (port 8085) ⭐ NEW
├── delivery-service/     # Delivery microservice (port 8081)
├── promotion-service/    # Promotion microservice (port 8082)
├── restaurant-service/   # Restaurant management (port 8083)
├── menu-service/         # Menu management (port 8084)
├── keycloak-realm.json   # Keycloak configuration ⭐ NEW
├── docker-compose.yml    # Full stack setup ⭐ NEW
├── KEYCLOAK_SETUP.md     # Authentication guide ⭐ NEW
├── frontend/             # Angular client app (port 4200)
└── admin-dashboard/      # Angular admin dashboard (port 4201)
```

## 🚀 Quick Start

### Option 1: Windows Local Keycloak (Recommended) ⭐

1. **Start Keycloak** (in PowerShell as Admin):
   ```powershell
   cd C:\keycloak\bin
   .\kc.bat start-dev
   ```
   
2. **Import realm** (see [KEYCLOAK_WINDOWS.md](./KEYCLOAK_WINDOWS.md) for details)

3. **Start services** (in separate terminals):
   ```bash
   cd eureka-server && mvn spring-boot:run        # Terminal 1
   cd api-gateway && mvn spring-boot:run          # Terminal 2
   cd user-service && mvn spring-boot:run         # Terminal 3
   cd delivery-service && mvn spring-boot:run     # Terminal 4
   ```

Access:
- **API Gateway**: http://localhost:8080
- **Keycloak Admin**: http://localhost:9090/admin (admin/admin)
- **Eureka**: http://localhost:8761

→ **[Complete Windows Setup Guide](./KEYCLOAK_WINDOWS.md)**

📋 **Verify your setup**: [SETUP_VERIFICATION.md](./SETUP_VERIFICATION.md) — Checklist to confirm everything works

🔧 **Having issues?**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — Common problems and solutions

---

### Option 2: Docker (Full Stack)

```bash
cd food-delivery
docker-compose up -d
```

Wait 30-60 seconds, then access:
- **API Gateway**: http://localhost:8080
- **Keycloak Admin**: http://localhost:8180/admin (admin/admin)
- **Eureka**: http://localhost:8761

---

### Option 3: Docker + Local Windows Keycloak

Use the alternative docker-compose file:
```bash
docker-compose -f docker-compose.local-keycloak.yml up -d
```

Then start Keycloak separately as in Option 1.

## 📋 Manual Startup (ordre obligatoire)

### 1. Eureka Server
```bash
cd eureka-server
mvn spring-boot:run
# → http://localhost:8761
```

### 2. API Gateway
```bash
cd api-gateway
mvn spring-boot:run
# → http://localhost:8080
```

### 3. User Service
```bash
cd user-service
mvn spring-boot:run
# → http://localhost:8085
# MySQL DB: user_db (créée automatiquement)
```

### 4. Delivery Service
```bash
cd delivery-service
mvn spring-boot:run
# → http://localhost:8081
# MySQL DB: delivery_db (créée automatiquement)
```

### 4. Promotion Service
```bash
cd promotion-service
mvn spring-boot:run
# → http://localhost:8082
# MySQL DB: promotion_db (créée automatiquement)
```

### 5. Frontend Angular
```bash
cd frontend
npm install
ng serve --port 4200
# → http://localhost:4200
```

### 6. Admin Dashboard
```bash
cd admin-dashboard
npm install
ng serve --port 4201
# → http://localhost:4201
```

---

## 🖥️ Frontend Authentication Setup

Your Angular frontend is now integrated with Keycloak OAuth2!

→ **[Frontend Keycloak Integration Guide](./FRONTEND_KEYCLOAK.md)**

**Login & Register Flow:**
1. Frontend on http://localhost:4200
2. Click "Login" → Redirects to Keycloak (http://localhost:9090)
3. After auth → Auto-redirects to dashboard
4. All API calls automatically include JWT token

## 🔑 Default Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | admin |
| restaurant_owner | Owner@123 | restaurant_owner |
| delivery_person | Delivery@123 | delivery_person |
| customer | Customer@123 | customer |

## 📝 Getting Access Token
For **Windows Local Keycloak** (port 9090):

```bash
curl -X POST http://localhost:9090/realms/foodexpress/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"
```

For **Docker Keycloak** (port 8180):
```bash
curl -X POST http://localhost:8180/realms/foodexpress/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"
```

Use the `access_token` in all API requests:
```bash
curl -H "Authorization: Bearer <access_token>" http://localhost:8080/api/v1/users/me
```

## API Endpoints (via Gateway with Authentication)

### Delivery Service
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /api/deliveries | Toutes les livraisons | DELIVERY_PERSON, ADMIN |
| GET | /api/deliveries/{id} | Livraison par ID | ✅ Required |
| GET | /api/deliveries/order/{orderId} | Par numéro de commande | ✅ Required |
| GET | /api/deliveries/stats | Statistiques | ADMIN |
| POST | /api/deliveries | Créer une livraison | ✅ Required |
| PUT | /api/deliveries/{id}/status | Changer le statut | DELIVERY_PERSON, ADMIN |
| DELETE | /api/deliveries/{id} | Supprimer | ADMIN |

### User Service
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /api/v1/users/me | Profile utilisateur courant | ✅ Required |
| GET | /api/v1/users/{id} | Détails utilisateur | ✅ Required |
| PUT | /api/v1/users/{id} | Modifier profil | ✅ Required |
| GET | /api/v1/users/{id}/status | Vérifier statut | ✅ Required |

### Promotion Service
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /api/promotions | Toutes les promotions | Optional |
| GET | /api/promotions/active | Promotions actives | Optional |
| GET | /api/promotions/stats | Statistiques | ADMIN |
| POST | /api/promotions | Créer une promotion | ADMIN |
| POST | /api/promotions/validate | Valider un code promo | ✅ Required |
| PUT | /api/promotions/{id} | Modifier | ADMIN |
| DELETE | /api/promotions/{id} | Supprimer | ADMIN |

## Statuts de livraison
`PENDING → CONFIRMED → PREPARING → PICKED_UP → ON_THE_WAY → DELIVERED`

## 🔐 Security & Authentication

- All services require OAuth2 JWT tokens (except public endpoints)
- Keycloak manages user authentication and roles
- Role-based access control (RBAC) on endpoints
- Token expiration: 1 hour (auto-refresh available)

**For detailed authentication setup, see [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md)**

## 🛠 Technologies

- **Backend**: Spring Boot 3.2, Spring Cloud, Spring Security
- **Database**: MySQL 8.0 (auto-created)
- **Authentication**: Keycloak OAuth2/OIDC
- **Discovery**: Eureka Service Registry
- **Gateway**: Spring Cloud Gateway
- **Frontend**: Angular with TypeScript
