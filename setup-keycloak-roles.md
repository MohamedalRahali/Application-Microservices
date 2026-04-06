# Keycloak Role Setup Guide

## 🎯 Quick Setup Steps

### 1. Configure Default Roles in Keycloak

1. **Access Keycloak Admin Console**: http://localhost:9090/admin
2. **Login**: admin / admin
3. **Select "foodexpress" realm** (dropdown at top-left)
4. **Go to "Realm roles"** (left sidebar)
5. **Click "default-roles-foodexpress"**
6. **Click "Assign role"**
7. **Select "customer" checkbox**
8. **Click "Assign"**

This ensures all new registrations get the "customer" role by default.

### 2. Assign Roles to Existing Users

For users without roles (like marwenazouzi44@gmail.com, yassindridi44@gmail.com):

1. **Go to "Users"** (left sidebar)
2. **Click on a user** (e.g., marwenazouzi44@gmail.com)
3. **Go to "Role mapping" tab**
4. **Click "Assign role"**
5. **Select appropriate role**:
   - **customer** - For regular food ordering
   - **restaurant_owner** - For restaurant management
   - **delivery_person** - For delivery drivers
   - **admin** - For system administration
6. **Click "Assign"**

### 3. Test the New Registration Flow

1. **Go to**: http://localhost:4200/login
2. **Click "S'inscrire"** (Register)
3. **Select user type** on the role selection page
4. **Click "Continue to Registration"**
5. **Complete Keycloak registration form**
6. **Should redirect to login page after registration**

## 🔧 Available Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **customer** | Regular users who order food | Customer frontend |
| **restaurant_owner** | Restaurant managers | Restaurant management features |
| **delivery_person** | Delivery drivers | Delivery tracking and management |
| **admin** | System administrators | Admin dashboard + all features |

## 🧪 Test Users (Pre-configured)

| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | Admin@123 | admin | admin@foodexpress.com |
| restaurant_owner | Owner@123 | restaurant_owner | owner@foodexpress.com |
| delivery_person | Delivery@123 | delivery_person | delivery@foodexpress.com |
| customer | Customer@123 | customer | customer@foodexpress.com |

## 🚀 Registration Flow

1. **User visits**: `/register`
2. **Selects role**: customer, restaurant_owner, or delivery_person
3. **Clicks "Continue"**: Redirects to Keycloak registration
4. **Completes registration**: Keycloak handles user creation
5. **Redirects to**: `/login` page
6. **User logs in**: Gets assigned the selected role

## 🔍 Troubleshooting

### Users Not Getting Roles
- Check if "customer" is in default-roles-foodexpress
- Manually assign roles in Keycloak admin console

### Registration Not Working
- Ensure Keycloak is running on port 9090
- Check that "User registration" is enabled in realm settings
- Verify redirect URIs include http://localhost:4200/*

### Role Assignment Issues
- Check browser console for errors
- Verify user service is running (if using backend role assignment)
- Manually assign roles through Keycloak admin console