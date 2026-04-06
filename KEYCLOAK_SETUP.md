# FoodExpress — User Service & Keycloak Integration Guide
## 📋 Quick Links

- **Using Local Windows Keycloak?** → See [KEYCLOAK_WINDOWS.md](./KEYCLOAK_WINDOWS.md) ⭐ START HERE
- **Using Docker Keycloak?** → Continue below
- **Troubleshooting?** → See section at the bottom

---
## Overview

The FoodExpress platform now includes:
- **User Service** (Port 8085): Manages user profiles and authentication integration
- **Keycloak** (Port 8180): OAuth2/OIDC identity provider
- **API Gateway** (Port 8080): Routes requests with OAuth2 validation
- **Secured Microservices**: All services validate JWT tokens

## Quick Start

### 1. Docker Compose (Recommended)

```bash
cd food-delivery
docker-compose up -d
```

This starts:
- MySQL database
- Keycloak server
- All microservices
- Eureka discovery

**Wait 30-60 seconds for services to initialize.**

### 2. Manual Setup

#### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Keycloak running on port 8180

#### Start Services (in order)

```bash
# Terminal 1: Eureka Server
cd eureka-server
mvn spring-boot:run

# Terminal 2: API Gateway
cd api-gateway
mvn spring-boot:run

# Terminal 3: User Service
cd user-service
mvn spring-boot:run

# Terminal 4: Delivery Service
cd delivery-service
mvn spring-boot:run

# Terminal 5: Other Services
cd promotion-service
mvn spring-boot:run
```

## Keycloak Configuration

### Access Keycloak Admin Console
```
URL: http://localhost:8180
Username: admin
Password: admin
```

### Default Users

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | admin, customer |
| restaurant_owner | Owner@123 | restaurant_owner, customer |
| delivery_person | Delivery@123 | delivery_person, customer |
| customer | Customer@123 | customer |

### Manual Realm Setup

If the realm doesn't auto-import:

1. Go to Keycloak Admin Console
2. Click "Create Realm"
3. Upload `keycloak-realm.json`
4. Click "Create"

## API Usage

### 1. Get Access Token

```bash
curl -X POST http://localhost:8180/realms/foodexpress/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=foodexpress-client&username=customer&password=Customer@123&grant_type=password"
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGc..."
}
```

### 2. Get Current User (Authenticated)

```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer <access_token>"
```

### 3. Place an Order (with Authentication)

```bash
curl -X POST http://localhost:8080/api/deliveries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "orderId": "ORD-001",
    "customerId": "customer-uuid",
    "restaurantId": "1",
    "deliveryAddress": "123 Main St",
    "estimatedDeliveryTime": 30,
    "totalPrice": 45.50
  }'
```

### 4. Track Delivery Status

```bash
curl -X GET http://localhost:8080/api/deliveries/order/ORD-001 \
  -H "Authorization: Bearer <access_token>"
```

## Architecture

```
┌─────────────┐
│   Frontend  │ (Angular 4200/4201)
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   API Gateway   │ (Port 8080)
│  + OAuth2 Validation
└──────┬──────────┘
       │
       ├──────────────┬──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼              ▼
   ┌───────┐    ┌──────────┐    ┌──────────┐    ┌───────────┐    ┌─────────┐
   │ User  │    │ Delivery │    │Promotion │    │Restaurant│    │  Menu   │
   │Service│    │ Service  │    │ Service  │    │ Service  │    │ Service │
   │8085   │    │   8081   │    │   8082   │    │   8083   │    │  8084   │
   └───┬───┘    └──┬───────┘    └──┬───────┘    └────┬─────┘    └────┬────┘
       │           │              │                  │               │
       └───────────┴──────────────┴──────────────────┴───────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  MySQL Database  │
                    │   (Port 3307)    │
                    └──────────────────┘
                              ▲
                              │
                    ┌──────────────────┐
                    │   Keycloak       │
                    │  (Port 8180)     │
                    └──────────────────┘
```

## Role-Based Access Control

### Roles
- **admin**: Full access to all services and admin endpoints
- **restaurant_owner**: Can manage restaurant menus and promotions
- **delivery_person**: Can update delivery status and location
- **customer**: Can place orders and track deliveries

### Endpoint Security

#### Public Endpoints
- `/api/v1/users/health`
- `/actuator/health/**`

#### Authenticated Endpoints
- `GET /api/v1/users/me` - Requires authentication
- `GET /api/deliveries/{id}` - Requires authentication
- `POST /api/deliveries` - Requires authentication

#### Role-Based Endpoints
- `GET /api/deliveries` - Requires `DELIVERY_PERSON` or `ADMIN`
- `GET /api/deliveries/stats` - Requires `ADMIN`
- `PUT /api/deliveries/{id}/status` - Requires `DELIVERY_PERSON` or `ADMIN`

## JWT Token Structure

The JWT token contains:
```json
{
  "sub": "user-id",
  "username": "customer",
  "email": "customer@foodexpress.com",
  "realm_access": {
    "roles": ["customer", "default-roles-foodexpress"]
  },
  "exp": 1234567890,
  "iat": 1234564290
}
```

## Troubleshooting

### Keycloak Not Starting
```bash
# Check if port 8180 is in use
netstat -an | grep 8180

# Kill the process
lsof -i :8180
kill -9 <PID>
```

### Services Can't Connect to Keycloak
- Ensure Keycloak is running: `curl http://localhost:8180`
- Check JWT issuer URI matches in `application.yml`
- Verify network connectivity in Docker

### JWT Token Validation Fails
- Token expired? Get a new one
- Check token isn't from a different realm
- Verify `issuer-uri` in service config

### Database Connection Issues
- Ensure MySQL is running on port 3307
- Check credentials in `application.yml`
- Database auto-creation: `?createDatabaseIfNotExist=true`

## User Registration Flow

1. **Frontend**: User submits registration form
2. **Keycloak**: Automatically creates Keycloak user
3. **User Service**: Creates database entry with Keycloak ID
4. **On Login**: JWT token issued with user roles

## Next Steps

1. **Frontend Integration**
   - Add Keycloak adapter for Angular
   - Implement OAuth2 login flow
   - Store tokens in localStorage

2. **Social Login**
   - Configure Google/GitHub providers in Keycloak
   - Add social login buttons

3. **Advanced Features**
   - Two-factor authentication
   - User profile customization
   - Audit logging

4. **Production Deployment**
   - Use HTTPS
   - Configure custom domain
   - Set up email verification
   - Configure password policies

## Configuration Files

### Main Files
- `keycloak-realm.json` - Keycloak realm configuration
- `docker-compose.yml` - Full stack Docker setup
- `user-service/src/main/resources/application.yml` - User service config
- `api-gateway/src/main/resources/application.yml` - Gateway config

### Service Configurations
All services have OAuth2 config in their `application.yml`:
```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8180/realms/foodexpress
          jwk-set-uri: http://localhost:8180/realms/foodexpress/protocol/openid-connect/certs
```

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `keycloak_id` - Link to Keycloak user
- `role` - User role
- `status` - Active/Inactive/Suspended
- `address`, `city`, `zip_code` - Address info

## Security Features

✅ OAuth2/OIDC authentication via Keycloak
✅ JWT token validation
✅ Role-based access control
✅ Encrypted passwords
✅ Token expiration (1 hour)
✅ Refresh token support (24 hours)
✅ CORS protection
✅ CSRF protection

## Performance Tuning

### Connection Pooling
```yaml
spring.datasource.hikari.maximum-pool-size: 10
spring.datasource.hikari.minimum-idle: 2
```

### JWT Caching
```yaml
spring.security.oauth2.resourceserver.jwt.cache-size: 1000
```

## Monitoring

View service health:
```bash
curl http://localhost:8761/eureka/apps # Eureka dashboard
curl http://localhost:8080/actuator/health # Gateway health
curl http://localhost:8085/actuator/health # User service health
```

---

**Configuration Complete!** ✅ Your FoodExpress platform is now secured with Keycloak authentication.
