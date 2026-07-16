async function globalEnvSetup() {
  process.env.DB_USER = 'dbUser';
  process.env.DB_PASSWORD = 'dbPassword';
  process.env.DB_NAME = 'dbName';
  process.env.DB_HOST = 'dbHost';
  process.env.DB_PORT = '5432';
  process.env.REDIS_URI = 'redis://host:port';
  process.env.SECRET = 'test-secret';
  process.env.SERVICE_URL = 'http://localhost:3000';
  process.env.SMTP_PORT = '587';
  process.env.GMAIL_CLIENT_ID = 'gmail-client-id';
  process.env.GMAIL_CLIENT_SECRET = 'gmail-client-secret';
  process.env.GMAIL_REDIRECT_URI = 'gmail-redirect-uri';
  process.env.GMAIL_REFRESH_TOKEN = 'gmail-refresh-token';
  process.env.GMAIL_SENDER_EMAIL = 'gmail-sender-email';
  process.env.OAUTH_LOGIN_URL = 'http://localhost:3000/login';
  process.env.SERVICE_RESET_PASSWORD_URL = 'http://localhost:3000/reset';
  process.env.SERVICE_VERIFY_EMAIL_URL = 'http://localhost:3000/verify';
  process.env.REDIRECT_URI = 'http://localhost:3000/callback';
  process.env.CLIENT_SECRET_PEPPER = 'test-pepper';
}
module.exports = globalEnvSetup;
