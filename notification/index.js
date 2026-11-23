import app from "./src/app.js";

import { config } from "./src/config/config.js";
import { connectRabbitMQ } from "./src/config/mq.js";
import { startNotificationConsumer } from "./src/consumers/notification.consumer.js";

const startServer = async () => {
  try {
    await connectRabbitMQ();
    await startNotificationConsumer();

    app.listen(config.PORT, () => {
      console.log("Notification Service Started", {
        port: config.PORT,
        env: config.NODE_ENV,
      });
    });
  } catch (error) {
    console.error("Failed to start Notification Service:", error.message);

    process.exit(1);
  }
};

startServer();