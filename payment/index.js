import app from "./src/app.js";
import connectToDb from "./src/config/db.js";
import { config } from "./src/config/config.js";

const startServer = async () => {
  try {
    connectToDb();

    const server = app.listen(config.PORT, () => {
      console.log("Payment Service Started", {
        port: config.PORT,
        env: config.NODE_ENV,
      });
    });
  } catch (error) {
    console.error("Error starting server", { error: error.message });
    process.exit(1);
  }
};

startServer();
