import app from "./src/app.js";
import connectToDb from "./src/config/db.js";
import { config } from "./src/config/config.js";

const PORT = config.PORT;

const startServer = async () => {
  try {
    connectToDb();

    const server = app.listen(config.PORT, () => {
      console.log("Product Service Started", {
        port: config.PORT,
        env: config.NODE_ENV,
      });
    });

    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION — shutting down", {
        error: err.message,
        stack: err.stack,
      });
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      console.error("UNCAUGHT EXCEPTION — shutting down", {
        error: err.message,
        stack: err.stack,
      });
      process.exit(1);
    });

    process.on("SIGTERM", () => {
      console.info("SIGTERM received — shutting down gracefully");
      server.close(() => {
        console.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Error starting server", { error: error.message });
    process.exit(1);
  }
};

startServer();
