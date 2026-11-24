import app from "./src/app.js";

import { config } from "./src/config/config.js";
import { connectRabbitMQ } from "./src/config/mq.js";
import { startNotificationConsumer } from "./src/consumers/notification.consumer.js";
import logger from "./src/utils/logger.js";

const startServer = async () => {
  try {
    await connectRabbitMQ();
    await startNotificationConsumer();

    app.listen(config.PORT, () => {
      logger.info(
        {
          port: config.PORT,
          environment: config.NODE_ENV,
        },
        "Notification Service started",
      );
    });
  } catch (error) {
    logger.fatal({ err: error }, "Failed to start Notification Service");

    process.exit(1);
  }
};

startServer();