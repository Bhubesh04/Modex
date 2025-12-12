// Load dotenv - always load it to ensure .env file is read
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Helper function to get env var with fallback
const getEnv = (key, defaultValue = '') => {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return value;
};

// Get email credentials - support both naming conventions
const getEmailUser = () => {
  return (getEnv('SMTP_EMAIL') || getEnv('EMAIL_USER') || '').trim();
};

const getEmailPass = () => {
  return (getEnv('SMTP_PASSWORD') || getEnv('EMAIL_PASS') || '').trim().replace(/\s+/g, ''); // Remove spaces for Gmail App Password
};

module.exports = {
  PORT: parseInt(getEnv('PORT', '5000'), 10),
  MONGODB_URI: getEnv('MONGODB_URI', 'mongodb+srv://bhubesh:bhubesh123@cluster0.arodjaf.mongodb.net/medconnect?retryWrites=true&w=majority'),
  JWT_SECRET: getEnv('JWT_SECRET', 'your-secret-key-change-in-production'),
  JWT_EXPIRE: getEnv('JWT_EXPIRE', '7d'),
  // Support both SMTP_EMAIL/SMTP_PASSWORD and EMAIL_USER/EMAIL_PASS
  SMTP_EMAIL: getEmailUser(),
  SMTP_PASSWORD: getEmailPass(),
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000')
};
