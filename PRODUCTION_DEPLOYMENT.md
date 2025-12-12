# 🚀 Production Deployment Guide - MedConnect+

## Quick Setup Checklist

### ✅ Step 1: Backend Environment Variables (Render)
1. Go to: https://render.com/dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add/Verify these variables:

```env
MONGODB_URI=mongodb+srv://bhubesh:bhubesh123@cluster0.arodjaf.mongodb.net/medconnect?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
SMTP_EMAIL=bhubeshashok7049@gmail.com
SMTP_PASSWORD=bsee imqe qmoa aymg
FRONTEND_URL=https://modex-mlb4.vercel.app
PORT=5000
NODE_ENV=production
```

5. **Restart** the service after adding/updating variables

### ✅ Step 2: Frontend Environment Variables (Vercel)
1. Go to: https://vercel.com/dashboard
2. Select your project: `modex-mlb4`
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```env
REACT_APP_API_URL=https://modex-2.onrender.com/api
```

**Important:**
- ✅ Check all environments: Production, Preview, Development
- ✅ After adding, go to **Deployments** tab
- ✅ Click **Redeploy** on the latest deployment

### ✅ Step 3: Verify Deployment

#### Test Backend
```bash
curl https://modex-2.onrender.com/api/health
```
Expected: `{"message":"MedConnect+ API is running"}`

#### Test Frontend Connection
1. Visit: https://modex-mlb4.vercel.app
2. Open Browser DevTools (F12)
3. Go to **Network** tab
4. Try logging in
5. Verify API calls go to: `https://modex-2.onrender.com/api/*`

## 🔧 Configuration Files

### Backend Routes (All prefixed with `/api/`)
```
/api/auth/*          - Authentication
/api/admin/*         - Admin operations
/api/receptionist/*  - Receptionist operations
/api/doctor/*        - Doctor operations
/api/patient/*       - Patient operations
/api/prescriptions/* - Prescription operations
/api/test/*          - Test endpoints
/api/health          - Health check
```

### Frontend API Configuration
- **Base URL:** `https://modex-2.onrender.com/api`
- **All calls use relative paths** (e.g., `/auth/login`)
- **Full URL:** `baseURL + relativePath`

## ✅ Current Status

- ✅ Backend: Deployed and configured
- ✅ Frontend: Deployed and configured
- ✅ CORS: Properly configured
- ✅ API Routes: All mapped correctly
- ⚠️ **Action Required:** Set `REACT_APP_API_URL` in Vercel

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution:** Verify `FRONTEND_URL` is set in Render backend environment variables

### Issue: API Connection Failed
**Solution:** 
1. Check `REACT_APP_API_URL` is set in Vercel
2. Verify backend is running: https://modex-2.onrender.com/api/health
3. Check browser console for specific errors

### Issue: 404 on API Calls
**Solution:** Ensure `REACT_APP_API_URL` includes `/api` suffix:
- ✅ Correct: `https://modex-2.onrender.com/api`
- ❌ Wrong: `https://modex-2.onrender.com`

## 📞 Support

If issues persist:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend build errors
3. Verify all environment variables are set correctly
4. Ensure both services are running

---

**Your deployment is production-ready! 🎉**

