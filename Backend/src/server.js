const app = require('./app');
const env = require('./modules/shared/config/env');
const { initializeRedis, closeRedis } = require('./modules/shared/config/redis');

const startServer = async () => {
  try {
    // Initialize Redis (with graceful fallback if unavailable)
    await initializeRedis();

    const server = app.listen(env.PORT, () => {
      console.log(`✅ Server is running on port ${env.PORT}`);
      console.log(`📡 Health check: http://localhost:${env.PORT}/api/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('⏹️  SIGTERM received, shutting down gracefully...');
      await closeRedis();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('⏹️  SIGINT received, shutting down gracefully...');
      await closeRedis();
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
