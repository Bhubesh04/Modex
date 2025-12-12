# 🚀 Deployment Checklist - MedConnect+

## ✅ Current Deployment Status

- **Backend:** https://modex-2.onrender.com/api ✅
- **Frontend:** https://modex-mlb4.vercel.app/ ✅

## 🔧 Configuration Updates Made

### 1. Backend CORS Configuration ✅
- Updated to explicitly allow `https://modex-mlb4.vercel.app`
- Also allows all `*.vercel.app` domains
- Allows localhost for development

### 2. Frontend API Configuration ✅
- Configured to use `https://modex-2.onrender.com/api`
- Environment variable support ready

## 📋 Backend Environment Variables (Render.com)

**Go to your Render dashboard → Backend Service → Environment**

Make sure these are set:

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

**Important:** After updating environment variables, restart your Render service!

## 📋 Frontend Environment Variables (Vercel)

**Go to your Vercel dashboard → Project → Settings → Environment Variables**

Make sure this is set:

```env
REACT_APP_API_URL=https://modex-2.onrender.com/api
```

**Important:** After adding/updating environment variables, redeploy your Vercel app!

## 🧪 Testing the Connection

### Step 1: Test Backend Health
Visit: https://modex-2.onrender.com/api/health

Expected response:
```json
{
  "message": "MedConnect+ API is running"
}
```

### Step 2: Test Frontend Connection
1. Open: https://modex-mlb4.vercel.app/
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Go to **Network** tab
5. Try to login or perform any action
6. Check Network tab - API calls should go to `https://modex-2.onrender.com/api`

### Step 3: Test CORS
1. Open: https://modex-mlb4.vercel.app/
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Run this in console:
```javascript
fetch('https://modex-2.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Should return: `{ message: "MedConnect+ API is running" }`

## 🐛 Troubleshooting

### Issue: CORS Error
**Error:** `Access to fetch at 'https://modex-2.onrender.com/api/...' from origin 'https://modex-mlb4.vercel.app' has been blocked by CORS policy`

**Solution:**
1. Verify `FRONTEND_URL=https://modex-mlb4.vercel.app` is set in Render backend
2. Restart your Render backend service
3. The CORS config already includes your Vercel URL, but restart ensures it's loaded

### Issue: API Connection Failed
**Error:** `Network Error` or `Failed to fetch`

**Solution:**
1. Check if backend is running: https://modex-2.onrender.com/api/health
2. Verify `REACT_APP_API_URL` is set in Vercel
3. Redeploy Vercel app after adding environment variable
4. Check browser console for specific error messages

### Issue: 401 Unauthorized
**Error:** `401 Unauthorized` on API calls

**Solution:**
1. This is normal for protected routes - make sure you're logged in
2. Check if JWT token is being sent in Authorization header
3. Verify JWT_SECRET matches between token creation and verification

### Issue: Backend Not Responding
**Error:** Backend returns 404 or connection timeout

**Solution:**
1. Check Render dashboard - service might be sleeping (free tier)
2. First request after sleep takes ~30 seconds to wake up
3. Verify backend service is running on Render
4. Check Render logs for errors

## 🔄 Redeploy Instructions

### Backend (Render.com)
1. Go to Render dashboard
2. Select your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Or push new code to trigger auto-deploy

### Frontend (Vercel)
1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click "Redeploy" on latest deployment
5. Or push new code to trigger auto-deploy

## 📝 Next Steps

1. ✅ Update backend environment variables on Render
2. ✅ Update frontend environment variables on Vercel
3. ✅ Restart backend service on Render
4. ✅ Redeploy frontend on Vercel (if env vars were added)
5. ✅ Test the connection using steps above
6. ✅ Verify login/registration works
7. ✅ Test appointment booking
8. ✅ Test prescription creation

## 🎯 Quick Verification Commands

### Check Backend
```bash
curl https://modex-2.onrender.com/api/health
```

### Check Frontend API Config
Open browser console on https://modex-mlb4.vercel.app/ and run:
```javascript
console.log(process.env.REACT_APP_API_URL || 'https://modex-2.onrender.com/api')
```

## ✅ Final Checklist

- [ ] Backend environment variables set on Render
- [ ] Frontend environment variables set on Vercel
- [ ] Backend service restarted on Render
- [ ] Frontend redeployed on Vercel (if needed)
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] API calls go to correct backend URL
- [ ] No CORS errors in browser console
- [ ] Login/Registration works
- [ ] All features tested

---

**Your deployment is ready! 🎉**

If you encounter any issues, check the troubleshooting section above or the Render/Vercel logs.

