# Quick Deployment Guide - MedConnect+

## ✅ Backend Already Deployed
Your backend is live at: **https://modex-2.onrender.com/api**

## 🔧 Frontend Configuration (DONE)

The frontend has been configured to connect to your deployed backend. The `axiosInstance.js` now uses:
- **Production URL:** `https://modex-2.onrender.com/api`
- **Fallback:** `http://localhost:5000/api` (for local development)

## 🚀 Deploy Frontend to Vercel (Easiest Method)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Navigate to Frontend
```bash
cd frontend
```

### Step 3: Deploy
```bash
vercel
```

### Step 4: Follow Prompts
- Login to Vercel (or create account)
- Link to existing project or create new
- **Important:** When asked for environment variables, add:
  ```
  REACT_APP_API_URL=https://modex-2.onrender.com/api
  ```

### Step 5: Done! 🎉
Your frontend will be deployed and automatically connected to your backend.

---

## 🌐 Alternative: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Sign up/Login
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Environment Variables:**
     - `REACT_APP_API_URL` = `https://modex-2.onrender.com/api`
6. Click "Deploy"

---

## 🔍 Verify Connection

After deployment, test the connection:

1. Open your deployed frontend URL
2. Open browser DevTools (F12)
3. Go to Network tab
4. Try logging in or any action
5. Check that API calls go to `https://modex-2.onrender.com/api`

---

## ⚙️ Backend CORS Update

The backend CORS has been updated to allow:
- Localhost (development)
- Vercel deployments (*.vercel.app)
- Netlify deployments (*.netlify.app)
- Render deployments (*.onrender.com)
- Your custom FRONTEND_URL from environment variables

---

## 📝 Environment Variables for Backend (Render.com)

Make sure these are set in your Render backend dashboard:

```
MONGODB_URI=mongodb+srv://bhubesh:bhubesh123@cluster0.arodjaf.mongodb.net/medconnect?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
SMTP_EMAIL=bhubeshashok7049@gmail.com
SMTP_PASSWORD=bsee imqe qmoa aymg
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=5000
```

---

## 🐛 Troubleshooting

### CORS Errors
- Make sure your frontend URL is added to backend CORS (already done)
- Check backend environment variables on Render

### API Connection Failed
- Verify backend is running: Visit `https://modex-2.onrender.com/api/health`
- Check frontend environment variable is set correctly
- Verify API URL in browser Network tab

### Build Errors
- Make sure you're in the `frontend` directory
- Run `npm install` first
- Check Node.js version (should be 14+)

---

## 📦 Current Status

✅ Backend deployed and running  
✅ Frontend configured to use production backend  
✅ CORS updated to allow frontend connections  
⏳ Frontend deployment pending (follow steps above)

