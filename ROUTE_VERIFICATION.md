# Route Verification - Frontend ↔ Backend Mapping

## Backend Route Prefixes (from `backend/src/app.js`)

All routes are mounted with `/api/` prefix:

```javascript
app.use('/api/auth', authRoutes);           // → /api/auth/*
app.use('/api/admin', adminRoutes);         // → /api/admin/*
app.use('/api/receptionist', receptionistRoutes); // → /api/receptionist/*
app.use('/api/doctor', doctorRoutes);       // → /api/doctor/*
app.use('/api/patient', patientRoutes);     // → /api/patient/*
app.use('/api/prescriptions', prescriptionRoutes); // → /api/prescriptions/*
app.use('/api/test', testRoutes);           // → /api/test/*
```

## Frontend API Base URL

**REACT_APP_API_URL:** `https://modex-2.onrender.com/api`

## Route Mapping Verification

### Authentication Routes ✅

| Frontend Call | Backend Route | Full URL | Status |
|--------------|---------------|----------|--------|
| `POST /auth/login` | `POST /api/auth/login` | `https://modex-2.onrender.com/api/auth/login` | ✅ |
| `POST /auth/register-patient` | `POST /api/auth/register-patient` | `https://modex-2.onrender.com/api/auth/register-patient` | ✅ |
| `POST /auth/register-admin` | `POST /api/auth/register-admin` | `https://modex-2.onrender.com/api/auth/register-admin` | ✅ |
| `POST /auth/register-doctor` | `POST /api/auth/register-doctor` | `https://modex-2.onrender.com/api/auth/register-doctor` | ✅ |
| `POST /auth/register-receptionist` | `POST /api/auth/register-receptionist` | `https://modex-2.onrender.com/api/auth/register-receptionist` | ✅ |

### Patient Routes ✅

| Frontend Call | Backend Route | Full URL | Status |
|--------------|---------------|----------|--------|
| `GET /patient/appointments` | `GET /api/patient/appointments` | `https://modex-2.onrender.com/api/patient/appointments` | ✅ |
| `GET /patient/prescriptions` | `GET /api/patient/prescriptions` | `https://modex-2.onrender.com/api/patient/prescriptions` | ✅ |
| `GET /patient/doctors` | `GET /api/patient/doctors` | `https://modex-2.onrender.com/api/patient/doctors` | ✅ |
| `GET /patient/slots/:doctorId/:date` | `GET /api/patient/slots/:doctorId/:date` | `https://modex-2.onrender.com/api/patient/slots/:doctorId/:date` | ✅ |
| `POST /patient/book-appointment` | `POST /api/patient/book-appointment` | `https://modex-2.onrender.com/api/patient/book-appointment` | ✅ |

### Doctor Routes ✅

| Frontend Call | Backend Route | Full URL | Status |
|--------------|---------------|----------|--------|
| `GET /doctor/appointments` | `GET /api/doctor/appointments` | `https://modex-2.onrender.com/api/doctor/appointments` | ✅ |
| `GET /doctor/appointment/:id` | `GET /api/doctor/appointment/:id` | `https://modex-2.onrender.com/api/doctor/appointment/:id` | ✅ |
| `GET /doctor/patients` | `GET /api/doctor/patients` | `https://modex-2.onrender.com/api/doctor/patients` | ✅ |
| `POST /doctor/prescription` | `POST /api/doctor/prescription` | `https://modex-2.onrender.com/api/doctor/prescription` | ✅ |

### Admin Routes ✅

| Frontend Call | Backend Route | Full URL | Status |
|--------------|---------------|----------|--------|
| `POST /admin/register-doctor` | `POST /api/admin/register-doctor` | `https://modex-2.onrender.com/api/admin/register-doctor` | ✅ |
| `POST /admin/register-receptionist` | `POST /api/admin/register-receptionist` | `https://modex-2.onrender.com/api/admin/register-receptionist` | ✅ |
| `GET /admin/doctors` | `GET /api/admin/doctors` | `https://modex-2.onrender.com/api/admin/doctors` | ✅ |
| `GET /admin/receptionists` | `GET /api/admin/receptionists` | `https://modex-2.onrender.com/api/admin/receptionists` | ✅ |

### Receptionist Routes ✅

| Frontend Call | Backend Route | Full URL | Status |
|--------------|---------------|----------|--------|
| `POST /receptionist/register-patient` | `POST /api/receptionist/register-patient` | `https://modex-2.onrender.com/api/receptionist/register-patient` | ✅ |
| `GET /receptionist/doctors` | `GET /api/receptionist/doctors` | `https://modex-2.onrender.com/api/receptionist/doctors` | ✅ |
| `GET /receptionist/slots/:doctorId/:date` | `GET /api/receptionist/slots/:doctorId/:date` | `https://modex-2.onrender.com/api/receptionist/slots/:doctorId/:date` | ✅ |
| `POST /receptionist/book-appointment` | `POST /api/receptionist/book-appointment` | `https://modex-2.onrender.com/api/receptionist/book-appointment` | ✅ |

### Prescription Routes ✅

| Frontend Call | Backend Route | Full URL | Status |
|--------------|---------------|----------|--------|
| `GET /prescriptions/by-token/:token` | `GET /api/prescriptions/by-token/:token` | `https://modex-2.onrender.com/api/prescriptions/by-token/:token` | ✅ |

## Summary

✅ **All routes are correctly mapped**
✅ **All frontend API calls use relative paths**
✅ **Base URL is correctly configured**
✅ **No hardcoded localhost URLs found**

