# Registration Not Working - Debug Guide 🔧

If registration doesn't work, follow these steps:

---

## 🔄 Step 1: Update Keycloak Realm (Registration Now Enabled)

I've updated `keycloak-realm.json` to enable user registration. You need to reimport it:

### Option A: Delete and Re-import Realm (Cleanest)

1. Go to: http://localhost:9090/admin
2. Login: admin / admin
3. Click on "foodexpress" realm (top left)
4. Click **"Delete"** button (top right)
5. Confirm deletion
6. Click **"Create Realm"** → Upload `keycloak-realm.json` again
7. Click **"Create"**

### Option B: Manual Configuration (If Option A fails)

1. Go to: http://localhost:9090/admin
2. Select "foodexpress" realm
3. Click **"Realm Settings"** (left menu)
4. Go to **"General"** tab
5. Find and **enable**:
   - ✅ "User registration allowed"
   - ✅ "Email as username"

---

## 🧹 Step 2: Clear Browser Cache

The frontend might have cached old configuration:

```powershell
# Clear browser storage (DevTools)
# Press F12 → Console → paste:
localStorage.clear()
sessionStorage.clear()
```

**Or manually in browser:**
1. Press **F12** (DevTools)
2. Go to **Application** tab
3. Click **Storage** → **Local Storage** → **http://localhost:4200**
4. Click **X** to delete all entries
5. Refresh page (F5)

---

## 🧪 Step 3: Test Registration

### Test Scenario 1: Click Register Button
1. Go to: http://localhost:4200/signup
2. Open **F12 DevTools** → **Console**
3. Click **"✨ Créer mon compte"** button
4. **Watch console** for messages like:
   ```
   Register button clicked
   Calling authService.register()
   Register called successfully
   ```

### Check for Errors:
- If you see errors, note them down
- Common errors:
  - `Cannot read property 'login' of undefined` → Keycloak not initialized
  - `Refused to navigate to...` → CORS issue
  - Network error → Keycloak not responding

### Test Scenario 2: If Console Shows Success
1. You should be **redirected to**: 
   ```
   http://localhost:9090/realms/foodexpress/protocol/openid-connect/auth
   ```
2. This shows Keycloak **registration page**
3. Fill in the form and create account

---

## 🔍 Verification Checklist

Before continuing, verify:

- [ ] **Keycloak running**
  ```bash
  curl http://localhost:9090
  ```

- [ ] **Realm "foodexpress" exists**
  - Go to: http://localhost:9090/admin
  - See "foodexpress" in list?

- [ ] **Registration is enabled in realm**
  - Click realm → Realm Settings → General
  - Check "User registration allowed"?

- [ ] **Frontend running**
  ```bash
  cd frontend
  npm start
  ```
  Visit: http://localhost:4200

- [ ] **Browser console clear**
  - Press F12
  - No errors in red?

---

## 🆘 Still Not Working?

### Problem: Button click does nothing

**Check 1: Is AuthService injected?**
```typescript
// In SignupComponent, check if you can see this in console:
constructor(
  private authService: AuthService  // ← Watch console.log("register button clicked")
) {}
```

**Check 2: Is Keycloak initialized?**
```powershell
# In browser console (F12):
keycloak.isLoggedIn()  # Should log true or false, not "undefined"
```

**Check 3: Is the method being called?**
```powershell
# In browser console, add this:
window.testRegister = () => console.log('Test works!');

# Then in browser console:
testRegister()

# Should print "Test works!"
```

---

### Problem: Redirects to blank page

**Solution 1: Check Keycloak response**
```powershell
# In browser console (F12) → Network tab
# Look for request to localhost:9090
# Status should be 302 (redirect) or 200 (HTML)
# If 500: Keycloak error
# If 0: Network blocked
```

**Solution 2: Check Keycloak logs**
Terminal where you started Keycloak, look for errors:
```
ERROR ... 500 ...
```

---

### Problem: CORS Error

If you see:
```
Access to XMLHttpRequest at 'http://localhost:9090/...' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Fix in Keycloak realm:**
1. Realm Settings → **Web Origins**
2. Add: `http://localhost:4200`

---

## 📋 Full Test Workflow

### Complete Step-by-Step:

```
1. Terminal 1: Start Keycloak
   cd C:\keycloak\keycloak-23.0.7\bin
   .\kc.bat start-dev
   
   Wait for: "Listening on http://localhost:9090"

2. Admin Console: Verify realm & registration
   http://localhost:9090/admin
   Login: admin/admin
   Check realm "foodexpress" exists
   Enable user registration (if not already)

3. Terminal 2: Start Frontend
   cd frontend
   npm start
   
   Wait for: "Listening on http://localhost:4200"

4. Browser: Test registration
   http://localhost:4200/signup
   Open DevTools (F12)
   Click "✨ Créer mon compte"
   
   Expected: Redirect to Keycloak registration page

5. Keycloak: Fill registration form
   Complete the form
   Click "Register"
   
   Expected: Auto-login and redirect to http://localhost:4200/dashboard
```

---

## 🎯 Success Indicators

When everything works, you'll see:

✅ **Browser Console** shows:
```
Register button clicked
Calling authService.register()
Register called successfully
```

✅ **URL changes to**:
```
http://localhost:9090/realms/foodexpress/protocol/...
```

✅ **Keycloak registration form** appears

✅ **After registration**, redirected to:
```
http://localhost:4200/dashboard
```

✅ **User is logged in** (can see user info)

---

## 💡 Pro Tips

1. **Use Incognito Window** to avoid stale caches:
   ```
   Ctrl + Shift + N (Windows)
   ```

2. **Check Keycloak Admin Console** for registered users:
   - http://localhost:9090/admin
   - Users → See new users being registered

3. **Default Users Still Work**:
   - username: customer
   - password: Customer@123

4. **Clear Everything** if stuck:
   ```powershell
   # Clear frontend cache
   localStorage.clear()
   sessionStorage.clear()
   
   # Restart Keycloak
   # Reimport realm
   # Restart Frontend
   ```

---

## 📞 When to Ask for Help

If you're still stuck, provide:

1. **Browser console output** (F12 → Console tab) - Screenshot or text
2. **Keycloak terminal output** - Look for ERROR lines
3. **Current URL** - What page are you on?
4. **Realm settings** - Is registration enabled?
5. **Keycloak version** - http://localhost:9090 → what version?

---

**Last Updated**: 2026-03-30
**Status**: ✅ Registration debugging guide
