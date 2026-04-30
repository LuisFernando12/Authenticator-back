async function globalEnvSetupt() {
  process.env.DB_USER = 'dbUser';
  process.env.DB_PASSWORD = 'dbPassword';
  process.env.DB_NAME = 'dbName';
  process.env.DB_HOST = 'dbHost';
  process.env.DB_PORT = '5432';
  process.env.REDIS_URI = 'redis://host:port';
  process.env.SECRET = 'test-secret';
  process.env.SERVICE_URL = 'http://localhost:3000';
  process.env.SMTP_PORT = '587';
  process.env.SERVER_SMTP = 'smtp.test.com';
  process.env.SERVER_SMTP_USER_NAME = 'test';
  process.env.SERVER_SMTP_PASSWORD = 'test';
  process.env.OAUTH_LOGIN_URL = 'http://localhost:3000/login';
  process.env.SERVICE_RESET_PASSWORD_URL = 'http://localhost:3000/reset';
  process.env.SERVICE_VERIFY_EMAIL_URL = 'http://localhost:3000/verify';
  process.env.REDIRECT_URI = 'http://localhost:3000/callback';
  process.env.CLIENT_SECRET_PEPPER = 'test-pepper';
}
module.exports = globalEnvSetupt;
