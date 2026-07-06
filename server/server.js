import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { env } from './src/config/env.js';

const startServer = async () => {
  // 1. Connect to Database
  await connectDB();

  // 2. Start Listening
  const port = env.port;
  app.listen(port, () => {
    console.log(`🚀 Server running in ${env.nodeEnv} mode on port ${port}`);
    console.log(`🔗 Healthcheck available at: http://localhost:${port}/status`);
  });
};

startServer();
