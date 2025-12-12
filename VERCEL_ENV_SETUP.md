# Vercel Environment Variable Setup

## Quick Setup for https://modex-mlb4.vercel.app/

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Login to your account
3. Select your project: `modex-mlb4` (or your project name)

### Step 2: Add Environment Variable
1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar
3. Click **Add New**
4. Add the following:

**Key:**
```
REACT_APP_API_URL
```

**Value:**
```
https://modex-2.onrender.com/api
```

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development

5. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 4: Verify
1. Visit: https://modex-mlb4.vercel.app/
2. Open Browser DevTools (F12)
3. Go to **Network** tab
4. Try any action (login, etc.)
5. Verify API calls go to `https://modex-2.onrender.com/api`

---

## Alternative: Using Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Link to your project
cd frontend
vercel link

# Add environment variable
vercel env add REACT_APP_API_URL production
# When prompted, enter: https://modex-2.onrender.com/api

# Redeploy
vercel --prod
```

---

## Important Notes

1. **Environment variables must start with `REACT_APP_`** for Create React App to include them in the build
2. **After adding env vars, you MUST redeploy** for changes to take effect
3. **The variable is baked into the build**, so it won't change until you rebuild/redeploy

