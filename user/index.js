import app from "./src/app.js";
import connectToDb from "./src/config/db.js";
import { config } from "./src/config/config.js";
import { connectRabbitMQ } from "./src/config/mq.js";
import logger from "./src/utils/logger.js";

const startServer = async () => {
  try {
    await connectToDb();
    await connectRabbitMQ();

    const server = app.listen(config.PORT, () => {
      logger.info(
        {
          port: config.PORT,
          environment: config.NODE_ENV,
        },
        "User Service started",
      );
    });

    process.on("unhandledRejection", (err) => {
      logger.fatal({ err }, "Unhandled rejection; shutting down");

      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      logger.fatal({ err }, "Uncaught exception; shutting down");

      process.exit(1);
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received; shutting down gracefully");

      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.fatal({ err: error }, "Failed to start User Service");

    process.exit(1);
  }
};

startServer();
