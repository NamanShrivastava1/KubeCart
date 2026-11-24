import app from "./src/app.js";
import connectToDb from "./src/config/db.js";
import { config } from "./src/config/config.js";
import logger from "./src/utils/logger.js";

const startServer = async () => {
  try {
    await connectToDb();

    const server = app.listen(config.PORT, () => {
      logger.info(
        {
          port: config.PORT,
          environment: config.NODE_ENV,
        },
        "Product Service started",
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
    logger.fatal({ err: error }, "Failed to start Product Service");
    process.exit(1);
  }
};

startServer();
