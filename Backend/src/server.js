const app = require('./app');
const env = require('./modules/shared/config/env');

app.listen(env.PORT, () => {
  console.log(`✅ Server is running on port ${env.PORT}`);
  console.log(`📡 Health check: http://localhost:${env.PORT}/api/health`);
});
