# MedConnect+ Deployment Guide

## Backend Deployment (Render.com) ✅
Your backend is already deployed at: `https://modex-2.onrender.com/`

## Frontend Configuration

### Option 1: Using Environment Variables (Recommended)

1. **Create `.env` file in the `frontend` folder:**
```env
REACT_APP_API_URL=https://modex-2.onrender.com/api
```

2. **For production builds, create `.env.production`:**
```env
REACT_APP_API_URL=https://modex-2.onrender.com/api
```

3. **For local development, create `.env.development`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Option 2: Direct Configuration (Already Done)
The `axiosInstance.js` has been updated to use the production URL by default.

## Frontend Deployment Options

### Option A: Deploy to Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Navigate to frontend folder:**
```bash
cd frontend
```

3. **Deploy:**
```bash
vercel
```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Set environment variable: `REACT_APP_API_URL=https://modex-2.onrender.com/api`

5. **Or deploy via Vercel Dashboard:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set Root Directory to `frontend`
   - Add environment variable: `REACT_APP_API_URL=https://modex-2.onrender.com/api`
   - Deploy!

### Option B: Deploy to Netlify (Free)

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=build
```

4. **Or use Netlify Dashboard:**
   - Go to https://netlify.com
   - Drag and drop the `frontend/build` folder
   - Add environment variable: `REACT_APP_API_URL=https://modex-2.onrender.com/api`

### Option C: Deploy to Render.com (Same as Backend)

1. **Create `render.yaml` in root:**
```yaml
services:
  - type: web
    name: medconnect-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/build
    envVars:
      - key: REACT_APP_API_URL
        value: https://modex-2.onrender.com/api
```

2. **Or use Render Dashboard:**
   - Create new Static Site
   - Connect GitHub repository
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`
   - Add environment variable: `REACT_APP_API_URL=https://modex-2.onrender.com/api`

## Backend Environment Variables (Render.com)

Make sure these are set in your Render backend service:

```
MONGODB_URI=mongodb+srv://bhubesh:bhubesh123@cluster0.arodjaf.mongodb.net/medconnect?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
SMTP_EMAIL=bhubeshashok7049@gmail.com
SMTP_PASSWORD=bsee imqe qmoa aymg
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=5000
```

## CORS Configuration

Make sure your backend `app.js` allows your frontend domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app',
    'https://your-frontend-url.netlify.app'
  ],
  credentials: true
}));
```

## Testing the Connection

1. **Check backend is running:**
   - Visit: `https://modex-2.onrender.com/api/health` (if you have a health endpoint)
   - Or test any API endpoint

2. **Test frontend connection:**
   - Open browser console
   - Check Network tab for API calls
   - Verify requests go to `https://modex-2.onrender.com/api`

## Quick Deploy Commands

### Local Development:
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm start
```

### Production Build:
```bash
# Frontend
cd frontend
npm install
npm run build
```

## Troubleshooting

1. **CORS Errors:**
   - Add your frontend URL to backend CORS whitelist
   - Check backend environment variables

2. **API Connection Failed:**
   - Verify backend URL is correct
   - Check backend is running on Render
   - Verify environment variables are set

3. **Build Errors:**
   - Make sure all dependencies are installed
   - Check Node.js version compatibility
   - Review build logs for specific errors

## Current Configuration

- **Backend URL:** `https://modex-2.onrender.com/api`
- **Frontend API URL:** Configured to use production backend
- **Database:** MongoDB Atlas (medconnect database)

